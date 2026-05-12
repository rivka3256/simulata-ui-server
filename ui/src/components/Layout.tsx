// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, FlaskConical, History, FileCode2, Radio, User } from "lucide-react";
// import type { ReactNode } from "react";

// const NAV_SECTIONS = [
//   {
//     label: "TESTING",
//     items: [
//       { to: "/profiles", label: "DDS Profiles", icon: FileCode2 },
//       { to: "/simulations", label: "Simulations", icon: FlaskConical },
//     ],
//   },
//   {
//     label: "MONITORING",
//     items: [
//       { to: "/", label: "Dashboard", icon: LayoutDashboard },
//       { to: "/history", label: "History", icon: History },
//     ],
//   },
// ];

// export default function Layout({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex h-screen bg-[#F8F9FA] font-['Heebo']">
//       {/* Sidebar - White */}
//       <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
//         <div className="flex items-center gap-2 px-6 h-[110px] border-b border-gray-100">
//           <span className="text-xl font-bold tracking-tight text-[#141E52]">SIMULATA</span>
//         </div>
        
//         <nav className="flex-1 px-4 py-6 space-y-8">
//           {NAV_SECTIONS.map((section) => (
//             <div key={section.label}>
//               <div className="px-4 mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
//                 {section.label}
//               </div>
//               <div className="space-y-1">
//                 {section.items.map(({ to, label, icon: Icon }) => (
//                   <NavLink
//                     key={to}
//                     to={to}
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
//                         isActive
//                           ? "bg-[#141E52] text-white"
//                           : "text-gray-500 hover:bg-gray-50"
//                       }`
//                     }
//                   >
//                     <Icon size={20} />
//                     {label}
//                   </NavLink>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Container */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* Navbar - המבנה המדויק מהפיגמה */}
//         <header className="h-[110px] bg-[#141E52] flex items-center justify-between px-[50px] shrink-0 relative">
          
//           {/* Left: Shiluvim Logo & Text */}
//           <div className="flex items-center gap-2 w-[204px]">
//              {/* כאן את שמה את התמונה של הסמל מהצבא */}
//           <img 
//   src="/shiluvim-logo.png" 
//   alt="Shiluvim" 
//   className="w-10 h-10 object-contain" 
// />
//              <span className="text-white text-[18px] font-medium font-['Heebo']">Shiluvim</span>
//           </div>

//           {/* Center: SIMULATA Branding */}
//           <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
//              <Radio size={32} className="text-cyan-400" /> 
//              <span className="text-white text-[38px] font-bold tracking-tight font-['Heebo'] uppercase">SIMULATA</span>
//           </div>
          
//           {/* Right: User Info */}
//           <div className="flex items-center justify-end gap-3 text-white w-[204px]">
//             <span className="text-[14px] font-medium font-['Heebo']">Hello, User</span>
//             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
//               <User size={18} />
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="flex-1 overflow-y-auto p-10">
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
import { type ReactNode } from "react"; // התיקון הקריטי לשגיאת ה-TypeScript
import { NavLink, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FlaskConical, 
  History, 
  FileCode2, 
  Radio, 
  User 
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "TESTING",
    items: [
      // { to: "/profiles", label: "DDS Profiles", icon: FileCode2 },
      { to: "/simulations", label: "Simulations", icon: FlaskConical },
    ],
  },
  {
    label: "MONITORING",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/history", label: "History", icon: History },
    ],
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-['Heebo']">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-2 px-6 h-[110px] border-b border-gray-100">
          <span className="text-xl font-bold tracking-tight text-[#141E52]">SIMULATA</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-8">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="px-4 mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#141E52] text-white"
                          : "text-gray-500 hover:bg-gray-50"
                      }`
                    }
                  >
                    <Icon size={20} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-[110px] bg-[#141E52] flex items-center justify-between px-[50px] shrink-0 relative">
          
          {/* לוגו שילובים ככפתור - הוספתי z-50 כדי לוודא ששום דבר לא מסתיר אותו */}
          <Link 
            to="/" 
            className="flex items-center gap-2 w-[204px] hover:opacity-80 transition-opacity cursor-pointer z-50"
          >
             <img 
               src="/shiluvim-logo.png" 
               alt="Shiluvim" 
               className="w-10 h-10 object-contain" 
             />
             <span className="text-white text-[18px] font-medium font-['Heebo']">Shiluvim</span>
          </Link>

          {/* מרכז: SIMULATA */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
             <Radio size={36} className="text-[#00E5FF]" /> 
             <span className="text-white text-[38px] font-bold tracking-tight font-['Heebo'] uppercase">SIMULATA</span>
          </div>
          
          {/* ימין: משתמש */}
          <div className="flex items-center justify-end gap-3 text-white w-[204px]">
            <span className="text-[14px] font-medium font-['Heebo']">Hello, User</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <User size={18} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-[1440px] mx-auto p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}