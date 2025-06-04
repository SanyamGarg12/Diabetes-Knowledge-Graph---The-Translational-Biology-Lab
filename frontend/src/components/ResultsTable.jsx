// const ResultsTable = ({ tableData }) => {
//   if (!tableData || tableData.length === 0) return <p>No data found.</p>;

//   console.log("Table Data:", tableData);  

//   const keys = Object.keys(tableData[0]);

//   return (
//     <table border="1">
//       <thead>
//         <tr>
//           {keys.map((key) => (
//             <th key={key}>{key}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {tableData.map((row, index) => (
//           <tr key={index}>
//             {keys.map((key) => (
//               <td key={key}>{row[key]}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default ResultsTable;


       

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles.css";

const ResultsTable = ({ tableData }) => {
  if (!tableData || tableData.length === 0) {
    return (
      <div className="no-data-message">
        No table data available for this query.
      </div>
    );
  }

  const keys = Object.keys(tableData[0]);

  return (
    <motion.div
      className="table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              {keys.map((key, index) => (
                <motion.th
                  key={key}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {key.replace(/_/g, ' ').toUpperCase()}
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                whileHover={{ backgroundColor: "rgba(52, 152, 219, 0.1)" }}
              >
                {keys.map((key) => (
                  <td key={key}>
                    {typeof row[key] === "object" ? (
                      <div className="object-cell">
                        {Object.entries(row[key]).map(([k, v]) => (
                          <div key={k} className="object-property">
                            <span className="property-name">{k}:</span>
                            <span className="property-value">{v}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ResultsTable;

