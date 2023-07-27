import React, { useState } from "react";
import "./App.styles.css";
import { ChartType } from "./App.data";
import { LinearDiagram } from "./components/linear-diagram";
import { GroupedDiagram } from "./components/grouped-diagram";
import { StackedDiagram } from "./components/stacked-diagram";

const App: React.FC = () => {
  const [type, setType] = useState<ChartType>(ChartType.Stacked);

  const handleChangeType = (value: ChartType) => () => {
    setType(value);
  };

  return (
    <div className="page-container">
      <div className="page-title">d3 diagrams</div>
      <div className="buttons-container">
        <div>
          <input
            type="radio"
            id={ChartType.Stacked}
            name="chartType"
            checked={type === ChartType.Stacked}
            value={ChartType.Stacked}
            onChange={handleChangeType(ChartType.Stacked)}
          />
          <label htmlFor={ChartType.Stacked}>Stacked</label>
        </div>
        <div>
          <input
            type="radio"
            id={ChartType.Grouped}
            name="chartType"
            checked={type === ChartType.Grouped}
            value={ChartType.Grouped}
            onChange={handleChangeType(ChartType.Grouped)}
          />
          <label htmlFor={ChartType.Grouped}>Grouped</label>
        </div>
        <div>
          <input
            type="radio"
            id={ChartType.Linear}
            name="chartType"
            checked={type === ChartType.Linear}
            value={ChartType.Linear}
            onChange={handleChangeType(ChartType.Linear)}
          />
          <label htmlFor={ChartType.Linear}>Linear</label>
        </div>
      </div>
      <div>
        {type === ChartType.Grouped && <GroupedDiagram />}
        {type === ChartType.Stacked && <StackedDiagram />}
        {type === ChartType.Linear && <LinearDiagram />}
      </div>
    </div>
  );
};

export default App;
