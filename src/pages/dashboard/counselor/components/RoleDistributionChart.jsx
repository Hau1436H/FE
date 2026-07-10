import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FaUsers } from "react-icons/fa";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

function RoleDistributionChart({ data }) {
  return (
    <div className="p-4 rounded-3 h-100" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
      <h5 className="mb-4 d-flex align-items-center gap-2 text-info">
        <FaUsers /> Phân bố định hướng nghề nghiệp
      </h5>
      
      {data.length === 0 ? (
        <p className="text-white-50">Chưa có dữ liệu.</p>
      ) : (
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="studentCount"
                nameKey="roleName"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#06060c", border: "1px solid #22223b", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default RoleDistributionChart;