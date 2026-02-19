import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { MOCK_HISTORY } from '../constants';

const data = [
  { name: 'Ene', docs: 4 },
  { name: 'Feb', docs: 3 },
  { name: 'Mar', docs: 6 },
  { name: 'Abr', docs: 8 },
  { name: 'May', docs: 5 },
  { name: 'Jun', docs: 9 },
];

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <div 
    className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-5 hover:shadow-md transition-shadow animate-slide-up ${delay}`}
  >
    <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')} flex-shrink-0`}>
      <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <div className="flex items-baseline space-x-2">
         <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
         {title === 'Solicitudes Totales' && <span className="text-xs font-bold text-green-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12%</span>}
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
         <h2 className="text-2xl font-bold text-slate-800 animate-fade-in">Resumen Ejecutivo</h2>
         <p className="text-slate-500 animate-fade-in">Vista general del estado de las solicitudes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Solicitudes Totales" value="34" icon={FileText} color="bg-blue-500" delay="delay-0" />
        <StatCard title="Pendientes" value="5" icon={Clock} color="bg-amber-500" delay="delay-100" />
        <StatCard title="Aprobadas" value="28" icon={CheckCircle} color="bg-emerald-500" delay="delay-200" />
        <StatCard title="Rechazadas" value="1" icon={AlertCircle} color="bg-rose-500" delay="delay-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-slide-up delay-200">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Actividad Mensual</h3>
             <select className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none text-slate-600">
                 <option>Últimos 6 meses</option>
                 <option>Este año</option>
             </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="docs" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-slide-up delay-300 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recientes</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {MOCK_HISTORY.map((doc, i) => (
              <div key={doc.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 
                     ${doc.status === 'Approved' ? 'bg-emerald-500' : 
                       doc.status === 'Pending Review' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{doc.templateName}</p>
                    <p className="text-xs text-slate-400">{doc.createdAt} • {doc.applicant}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500">
                        <Clock className="w-4 h-4" />
                    </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
              Ver historial completo
          </button>
        </div>
      </div>
    </div>
  );
};