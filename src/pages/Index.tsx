
import VideoCall from "@/components/VideoCall";
import { useTheme } from "../contexts/ThemeContext";

const Index = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  return (
    <div className={`min-h-screen ${themeClasses.background} transition-all duration-300`}>
      <VideoCall />
    </div>
  );
};

export default Index;
