import { ScheduleProvider } from "./context";
import ScheduleTables from "./components/schedule/ScheduleTables.tsx";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";

function App() {
  return (
    <ScheduleProvider>
      <ScheduleDndProvider>
        <ScheduleTables/>
      </ScheduleDndProvider>
    </ScheduleProvider>
  );
}

export default App;
