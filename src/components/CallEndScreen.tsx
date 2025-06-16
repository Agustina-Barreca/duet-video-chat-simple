
import { useTheme } from "../contexts/ThemeContext";

interface CallEndScreenProps {
  userName: string | null;
  onStartNewCall: () => void;
}

const CallEndScreen = ({ userName, onStartNewCall }: CallEndScreenProps) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
      <div className="text-center">
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 bg-white rounded-sm"></div>
        </div>
        <h2 className={`text-2xl font-semibold mb-2 ${themeClasses.textPrimary}`}>Llamada terminada</h2>
        <p className={`mb-2 ${themeClasses.textSecondary}`}>La videollamada ha finalizado</p>
        <p className={`text-sm mb-6 ${themeClasses.textSecondary}`}>Hasta luego, {userName}</p>
        <button 
          onClick={onStartNewCall}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Iniciar nueva llamada
        </button>
      </div>
    </div>
  );
};

export default CallEndScreen;
