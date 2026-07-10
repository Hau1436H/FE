import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaChartLine } from "react-icons/fa";

function MarketAlignmentChart({ data }) {
  return (
    <div className="p-4 rounded-3 h-100" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
      <h5 className="mb-4 d-flex align-items-center gap-2 text-warning">
        <FaChartLine /> Độ vênh: Sinh viên vs Nhu cầu thị trường
      </h5>
      
      {data.length === 0 ? (
        <p className="text-white-50">Chưa có dữ liệu.</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22223b" vertical={false} />
              <XAxis dataKey="skillName" stroke="#6c757d" fontSize={12} tickLine={false} />
              <YAxis stroke="#6c757d" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#06060c", border: "1px solid #22223b", color: "#fff" }}
                cursor={{ fill: "#1e1e2f" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="marketDemandPercentage" name="Nhu cầu thị trường (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="studentAdoptionPercentage" name="Sinh viên đang học (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default MarketAlignmentChart;