import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { SimulationConfig } from "../models/SimulationConfig.entity.js";
import { ProductionConfig } from "../models/ProductionConfig.entity.js";
import { ContractConfig } from "../models/ContractConfig.entity.js";
import { DataReader } from "../models/DataReader.entity.js";
import { DataWriter } from "../models/DataWriter.entity.js";
import { SimulationRun } from "../models/SimulationRun.entity.js";
import { LogsResult } from "../models/LogsResult.entity.js";
import { AnalyzedSimulationResult } from "../models/AnalyzedSimulationResult.entity.js";
import { ContractResult } from "../models/ContractResult.entity.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [
    SimulationConfig,
    ProductionConfig,
    ContractConfig,
    DataReader,
    DataWriter,
    SimulationRun,
    LogsResult,
    AnalyzedSimulationResult,
    ContractResult,
  ],
  subscribers: [],
  migrations: [],
});
