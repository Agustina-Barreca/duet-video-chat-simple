
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface NameFormProps {
  onSubmit: (name: string) => void;
}

const NameForm = ({ onSubmit }: NameFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Bienvenido a la videollamada</h2>
          <p className="text-gray-300">Ingresa tu nombre para comenzar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white text-sm font-medium">
              Tu nombre
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Escribe tu nombre aquí..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3"
            disabled={!name.trim()}
          >
            Iniciar llamada
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NameForm;
