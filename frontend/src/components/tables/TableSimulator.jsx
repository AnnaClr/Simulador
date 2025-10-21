import React from "react";
import "./TableSimulator.css";

const FIRST_COLUMN_TITLES = {
  preparoSolo: "PREPARO DO SOLO",
  insumos: "INSUMOS",
  preparoArea: "PREPARO DA ÁREA",
  servicos: "SERVIÇOS",
};

const TableSimulator = ({
  tableData,
  tableType,
  columnsConfig,
  editing,
  handleEditStart,
  handleEditChange,
  handleEditBlur,
  hectares,
}) => {
  const columns = columnsConfig[tableType] || [];

  const totalGeral = tableData.reduce(
    (total, row) => total + row.qty * row.unitValue * hectares,
    0
  );

  return (
    <section className="table-responsive-container">
      <div className="outer-container">
        <div className="table-scroll-wrapper">
          <table className="simulator-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={col}>
                    {index === 0
                      ? FIRST_COLUMN_TITLES[tableType]
                      : col === "unit"
                      ? "UNIDADE"
                      : col === "qty"
                      ? "QUANTIDADE"
                      : col === "unitValue"
                      ? "VALOR UNITÁRIO"
                      : col}
                  </th>
                ))}
                <th scope="col">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td key={col}>
                      {editing?.type === tableType &&
                      editing?.index === rowIndex &&
                      editing?.field === col ? (
                        <input
                          type="number"
                          min="0"
                          value={row[col]}
                          onChange={handleEditChange}
                          onBlur={handleEditBlur}
                          autoFocus
                          style={{
                            border: "1px solid #4a91e20",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            width:
                              col === "qty" || col === "unitValue"
                                ? "90px"
                                : "100px",
                          }}
                          step="1"
                          aria-label={`Editar ${col} da linha ${rowIndex + 1}`}
                        />
                      ) : (
                        <div
                          onDoubleClick={() => {
                            if (col === "qty" || col === "unitValue") {
                              handleEditStart(tableType, rowIndex, col);
                            }
                          }}
                          className={
                            (col === "qty" || col === "unitValue") &&
                            window.innerWidth <= 768
                              ? "mobile-hover"
                              : ""
                          }
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            transition: "background-color 0.2s ease",
                            cursor:
                              col === "qty" || col === "unitValue"
                                ? "pointer"
                                : "default",
                            backgroundColor:
                              editing?.type === tableType &&
                              editing?.index === rowIndex &&
                              editing?.field === col
                                ? "#ebebeb"
                                : window.innerWidth <= 768 &&
                                  (col === "qty" || col === "unitValue")
                                ? "#ebebeb"
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (col === "qty" || col === "unitValue") {
                              e.currentTarget.style.backgroundColor = "#ebebeb";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (
                              editing?.type !== tableType ||
                              editing?.index !== rowIndex ||
                              editing?.field !== col
                            ) {
                              e.currentTarget.style.backgroundColor =
                                window.innerWidth <= 768 &&
                                (col === "qty" || col === "unitValue")
                                  ? "#ebebeb"
                                  : "transparent";
                            }
                          }}
                        >
                          {col === "unitValue"
                            ? `R$ ${parseFloat(row[col]).toFixed(2)}`
                            : row[col]}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="total-col">
                    R$ {(row.qty * row.unitValue * hectares).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={columns.length} className="text-right font-bold">
                  SUBTOTAL:
                </td>
                <td className="total-col font-bold">
                  R$ {totalGeral.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TableSimulator;
