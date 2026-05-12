# 🔄 תיאום Backend ↔ Frontend - SIMULATA

## 📋 סיכום הבעיה

ה-Frontend מצפה למבנה שונה מזה שה-Backend מספק כרגע.

---

## ✅ פתרון מומלץ: הוספת עמודה `scenario_config` ל-`simulation_config`

### שלב 1: עדכון הטבלה (SQL Migration)

```sql
-- הוספת עמודות חדשות לטבלה simulation_config
ALTER TABLE simulation_config 
ADD COLUMN description TEXT,
ADD COLUMN scenario_config JSONB;

-- אינדקס לשיפור ביצועים (אופציונלי)
CREATE INDEX idx_simulation_config_scenario_config ON simulation_config USING GIN (scenario_config);
```

---

### שלב 2: עדכון ה-Entity (TypeORM)

עדכני את `SimulationConfig.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { SimulationRun } from './SimulationRun.entity.js';
import { ProductionConfig } from './ProductionConfig.entity.js';

@Entity('simulation_config')
export class SimulationConfig {
  @PrimaryGeneratedColumn('uuid')
  simulation_config_id: string;

  @Column({ type: 'text' })
  scenario_name: string;

  // ← חדש! תיאור הסימולציה
  @Column({ type: 'text', nullable: true })
  description: string;

  // ← חדש! קונפיגורציה מלאה של הסימולציה
  @Column({ type: 'jsonb', nullable: true })
  scenario_config: {
    transport_latency_ms?: number;
    transport_jitter_ms?: number;
    phases?: Array<{
      name: string;
      actions: Array<{
        type: string; // 'send_messages' | 'read_messages'
        params?: {
          count?: number;
          frequency?: number;
        };
      }>;
    }>;
    assertions?: Array<{
      type: string; // 'delivery_complete' | 'no_errors' | 'all_matched'
      scope?: string; // 'all'
    }>;
  };

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => SimulationRun, (run) => run.simulationConfig)
  runs: SimulationRun[];

  @ManyToMany(() => ProductionConfig)
  @JoinTable({
    name: 'production_in_simulation',
    joinColumn: { name: 'simulation_config_id', referencedColumnName: 'simulation_config_id' },
    inverseJoinColumn: { name: 'production_id', referencedColumnName: 'production_config_id' }
  })
  productions: ProductionConfig[];
}
```

---

### שלב 3: יצירת DTO (Data Transfer Object)

צרי קובץ חדש `simulation-config.dto.ts`:

```typescript
export class CreateSimulationConfigDto {
  scenario_name: string;
  description?: string;
  scenario_config?: {
    transport_latency_ms?: number;
    transport_jitter_ms?: number;
    phases?: Array<{
      name: string;
      actions: Array<{
        type: string;
        params?: {
          count?: number;
          frequency?: number;
        };
      }>;
    }>;
    assertions?: Array<{
      type: string;
      scope?: string;
    }>;
  };
}

export class UpdateSimulationConfigDto extends CreateSimulationConfigDto {
  simulation_config_id: string;
}

export class SimulationConfigResponseDto {
  simulation_config_id: string;
  scenario_name: string;
  description?: string;
  scenario_config?: any;
  created_at: Date;
}
```

---

### שלב 4: יצירת Controller

צרי `simulation-config.controller.ts`:

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SimulationConfigService } from './simulation-config.service';
import { CreateSimulationConfigDto, UpdateSimulationConfigDto } from './simulation-config.dto';

@Controller('api/simulations')
export class SimulationConfigController {
  constructor(private readonly simulationConfigService: SimulationConfigService) {}

  // GET /api/simulations - רשימת כל הסימולציות
  @Get()
  async listSimulations() {
    return this.simulationConfigService.findAll();
  }

  // GET /api/simulations/:id - סימולציה ספציפית
  @Get(':id')
  async getSimulation(@Param('id') id: string) {
    return this.simulationConfigService.findOne(id);
  }

  // POST /api/simulations - יצירת סימולציה חדשה
  @Post()
  async createSimulation(@Body() dto: CreateSimulationConfigDto) {
    return this.simulationConfigService.create(dto);
  }

  // PUT /api/simulations/:id - עדכון סימולציה קיימת
  @Put(':id')
  async updateSimulation(
    @Param('id') id: string,
    @Body() dto: UpdateSimulationConfigDto
  ) {
    return this.simulationConfigService.update(id, dto);
  }

  // DELETE /api/simulations/:id - מחיקת סימולציה
  @Delete(':id')
  async deleteSimulation(@Param('id') id: string) {
    return this.simulationConfigService.delete(id);
  }
}
```

---

### שלב 5: יצירת Service

צרי `simulation-config.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimulationConfig } from './SimulationConfig.entity';
import { CreateSimulationConfigDto, UpdateSimulationConfigDto } from './simulation-config.dto';

@Injectable()
export class SimulationConfigService {
  constructor(
    @InjectRepository(SimulationConfig)
    private simulationConfigRepository: Repository<SimulationConfig>,
  ) {}

  // רשימת כל הסימולציות
  async findAll(): Promise<SimulationConfig[]> {
    return this.simulationConfigRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  // סימולציה ספציפית
  async findOne(id: string): Promise<SimulationConfig> {
    const simulation = await this.simulationConfigRepository.findOne({
      where: { simulation_config_id: id }
    });
    
    if (!simulation) {
      throw new NotFoundException(`Simulation with ID ${id} not found`);
    }
    
    return simulation;
  }

  // יצירת סימולציה חדשה
  async create(dto: CreateSimulationConfigDto): Promise<SimulationConfig> {
    const simulation = this.simulationConfigRepository.create({
      scenario_name: dto.scenario_name,
      description: dto.description,
      scenario_config: dto.scenario_config
    });
    
    return this.simulationConfigRepository.save(simulation);
  }

  // עדכון סימולציה קיימת
  async update(id: string, dto: UpdateSimulationConfigDto): Promise<SimulationConfig> {
    const simulation = await this.findOne(id);
    
    simulation.scenario_name = dto.scenario_name ?? simulation.scenario_name;
    simulation.description = dto.description ?? simulation.description;
    simulation.scenario_config = dto.scenario_config ?? simulation.scenario_config;
    
    return this.simulationConfigRepository.save(simulation);
  }

  // מחיקת סימולציה
  async delete(id: string): Promise<void> {
    const result = await this.simulationConfigRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Simulation with ID ${id} not found`);
    }
  }
}
```

---

## 🔗 עדכון ה-Frontend (api.ts)

עכשיו צריך לשנות את `api.ts` כדי שיתחבר ל-Backend האמיתי:

```typescript
// הגדרת כתובת ה-Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// פונקציה כללית לקריאות API
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// רשימת סימולציות
export async function listScenarios(): Promise<ScenarioInfo[]> {
  const data = await apiCall<any[]>('/simulations');
  
  // המרה מפורמט Backend לפורמט Frontend
  return data.map(sim => ({
    id: sim.simulation_config_id,
    simulation_config_id: sim.simulation_config_id,
    name: sim.scenario_name,
    scenario_name: sim.scenario_name,
    description: sim.description,
    scenario_config: sim.scenario_config,
    last_run: sim.created_at
  }));
}

// יצירת סימולציה חדשה
export async function createScenario(data: any): Promise<ScenarioInfo> {
  const payload = {
    scenario_name: data.scenario_name || data.name,
    description: data.description,
    scenario_config: data.scenario_config
  };

  const result = await apiCall<any>('/simulations', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return {
    id: result.simulation_config_id,
    simulation_config_id: result.simulation_config_id,
    name: result.scenario_name,
    scenario_name: result.scenario_name,
    description: result.description,
    scenario_config: result.scenario_config
  };
}

// עדכון סימולציה קיימת
export async function updateScenario(id: string, data: any): Promise<ScenarioInfo> {
  const payload = {
    simulation_config_id: id,
    scenario_name: data.scenario_name || data.name,
    description: data.description,
    scenario_config: data.scenario_config
  };

  const result = await apiCall<any>(`/simulations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  return {
    id: result.simulation_config_id,
    simulation_config_id: result.simulation_config_id,
    name: result.scenario_name,
    scenario_name: result.scenario_name,
    description: result.description,
    scenario_config: result.scenario_config
  };
}

// מחיקת סימולציה
export async function deleteScenario(id: string): Promise<void> {
  await apiCall(`/simulations/${id}`, { method: 'DELETE' });
}
```

---

## 📝 דוגמת נתונים

### מה ה-Frontend שולח ל-Backend:

```json
{
  "scenario_name": "GridOps Full Test",
  "description": "End-to-end grid operations simulation",
  "scenario_config": {
    "transport_latency_ms": 10,
    "transport_jitter_ms": 5,
    "phases": [
      {
        "name": "setup",
        "actions": [
          {
            "type": "send_messages",
            "params": { "count": 5, "frequency": 1 }
          }
        ]
      },
      {
        "name": "test execution",
        "actions": [
          {
            "type": "send_messages",
            "params": { "count": 100, "frequency": 10 }
          },
          {
            "type": "read_messages",
            "params": { "count": 100, "frequency": 10 }
          }
        ]
      }
    ],
    "assertions": [
      { "type": "delivery_complete", "scope": "all" },
      { "type": "no_errors", "scope": "all" },
      { "type": "all_matched", "scope": "all" }
    ]
  }
}
```

### מה ה-Backend מחזיר ל-Frontend:

```json
{
  "simulation_config_id": "550e8400-e29b-41d4-a716-446655440000",
  "scenario_name": "GridOps Full Test",
  "description": "End-to-end grid operations simulation",
  "scenario_config": {
    "transport_latency_ms": 10,
    "transport_jitter_ms": 5,
    "phases": [...],
    "assertions": [...]
  },
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎯 סיכום - מה צריך לעשות?

### Backend (חברה שלך):
1. ✅ להריץ את ה-SQL Migration (הוספת `description` ו-`scenario_config`)
2. ✅ לעדכן את `SimulationConfig.entity.ts`
3. ✅ ליצור Controller + Service + DTO
4. ✅ להוסיף CORS אם צריך:
   ```typescript
   app.enableCors({
     origin: 'http://localhost:5173', // כתובת ה-Frontend
     credentials: true
   });
   ```

### Frontend (את):
1. ✅ ליצור קובץ `.env` עם:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
2. ✅ לעדכן את `api.ts` עם הפונקציות החדשות
3. ✅ להחליף את ה-Mock Data בקריאות API אמיתיות

---

## 🚀 בדיקה

לאחר השינויים, בדקי:
1. יצירת סימולציה חדשה ב-Frontend → האם היא נשמרת ב-DB?
2. עריכת סימולציה קיימת → האם השינויים מתעדכנים?
3. מחיקת סימולציה → האם היא נמחקת מה-DB?
4. רענון הדף → האם הנתונים נטענים מה-DB?

---

## ❓ שאלות נפוצות

**Q: מה קורה עם `ProductionConfig` ו-`ContractConfig`?**  
A: הם נשארים בטבלה לצורך עתידי, אבל כרגע לא בשימוש פעיל.

**Q: האם צריך למחוק את המבנה הישן?**  
A: לא! אפשר לשמור אותו למקרה שתרצו להשתמש בו בעתיד.

**Q: מה עם ה-Runs?**  
A: `SimulationRun` נשאר כמו שהוא, רק צריך לוודא שהוא מקושר ל-`simulation_config_id` הנכון.

---

**בהצלחה! 🎉**
