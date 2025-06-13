// Novo dashboard.tsx usando os novos endpoints e filtros globais
'use client';

import { buscarDistribuicaoTipos } from '../../../services/api_dashboard_py';
import { Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
ChartJS.register(ArcElement);
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import SidebarPerito from '../../components/SidebarPerito';
import HeaderPerito from '../../components/HeaderPerito';
const Mapa = dynamic(() => import('../../components/Mapa'), { ssr: false });
import {
  buscarCasos,
  buscarCoeficientes,
  buscarCorrelacoes,
  buscarAcuracia,
  buscarProbabilidadePorIdade,
  buscarLocalizacoes,
  fazerPredicao
} from '../../../services/api_dashboard_py';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);



export default function Dashboard() {
  const [filtros, setFiltros] = useState({
    sexo: 'todos',
    etnia: 'todos',
    idadeMin: null,
    idadeMax: null,
    dataInicio: null,
    dataFim: null,
  });

  const [casos, setCasos] = useState([]);
  const [coefs, setCoefs] = useState<any>({});
  const [correlacao, setCorrelacao] = useState<any>(null);
  const [acuracia, setAcuracia] = useState<any>(null);
  const [probIdade, setProbIdade] = useState<any[]>([]);
  const [localizacoes, setLocalizacoes] = useState<any[]>([]);
  const [pizzaData, setPizzaData] = useState<any>(null);
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [c, co, corr, acc, prob, locs, pizza] = await Promise.all([
          buscarCasos(filtros),
          buscarCoeficientes(),
          buscarCorrelacoes(),
          buscarAcuracia(filtros),
          buscarProbabilidadePorIdade(filtros),
          buscarLocalizacoes(filtros),
          buscarDistribuicaoTipos(filtros),
        ]);
        setCasos(c);
        setCoefs(co);
        setCorrelacao(corr);
        setAcuracia(acc);
        setProbIdade(prob);
        setLocalizacoes(locs);
        setPizzaData(pizza); // <- crie o useState para armazenar

      } catch (e) {
        console.error("Erro ao carregar dados do dashboard:", e);
      }
    }
    carregar();
  }, [filtros]);

  const graficoCoefs = {
    labels: Object.keys(coefs),
    datasets: [
      {
        label: 'Importância das Variáveis',
        data: Object.values(coefs),
        backgroundColor: '#5d759c',
      },
    ],
  };

  const [input, setInput] = useState({
    idade: 30,
    etnia: 'Branca',
    localizacao: 'Centro',
  });

  const graficoPizza = pizzaData && {
    labels: Object.keys(pizzaData),
    datasets: [
      {
        data: Object.values(pizzaData),
        backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'],
      },
    ],
  };

  const graficoAcuracia = acuracia && {
    labels: acuracia.classes,
    datasets: [
      {
        label: 'Acurácia por Tipo de Caso (%)',
        data: acuracia.precisao,
        backgroundColor: '#7b90b1',
      },
    ],
  };

  async function handlePredizer() {
    try {
      const res = await fazerPredicao(input);
      setResultado(res);
    } catch (e) {
      console.error("Erro na predição:", e);
    }
  }

  const graficoProbIdade = {
    labels: probIdade.map((d) => d.faixa),
    datasets:
      probIdade.length > 0
        ? Object.keys(probIdade[0].probabilidades).map((classe, idx) => ({
          label: classe,
          data: probIdade.map((d) => d.probabilidades[classe]),
          borderColor: `hsl(${idx * 60}, 70%, 60%)`,
          fill: false,
        }))
        : [],
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <SidebarPerito />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderPerito />
        <main className="p-4 space-y-8 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white">Dashboard com Modelos</h1>

          {/* Filtros */}
          <div className="bg-white p-4 rounded flex flex-wrap gap-4 items-center">
            <select
              value={filtros.sexo}
              onChange={(e) => setFiltros({ ...filtros, sexo: e.target.value })}
            >
              <option value="todos">Todos os Sexos</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>
            <select
              value={filtros.etnia}
              onChange={(e) => setFiltros({ ...filtros, etnia: e.target.value })}
            >
              <option value="todos">Todas as Etnias</option>
              <option value="Branca">Branca</option>
              <option value="Preta">Preta</option>
              <option value="Parda">Parda</option>
            </select>
            <DatePicker
              selected={filtros.dataInicio ? new Date(filtros.dataInicio) : null}
              onChange={(date) => setFiltros({ ...filtros, dataInicio: date?.toISOString().split('T')[0] })}
              placeholderText="Data Início"
            />
            <DatePicker
              selected={filtros.dataFim ? new Date(filtros.dataFim) : null}
              onChange={(date) => setFiltros({ ...filtros, dataFim: date?.toISOString().split('T')[0] })}
              placeholderText="Data Fim"
            />
          </div>

          <div className="bg-white p-4 rounded space-y-4">
            <h2 className="text-lg font-semibold">Predição de Tipo de Caso</h2>

            <input
              type="number"
              placeholder="Idade"
              value={input.idade}
              onChange={(e) => setInput({ ...input, idade: Number(e.target.value) })}
              className="border p-2 rounded w-full"
            />
            <select
              value={input.etnia}
              onChange={(e) => setInput({ ...input, etnia: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="Branca">Branca</option>
              <option value="Preta">Preta</option>
              <option value="Parda">Parda</option>
              <option value="Amarela">Amarela</option>
              <option value="Indígena">Indígena</option>
            </select>
            <select
              value={input.localizacao}
              onChange={(e) => setInput({ ...input, localizacao: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="Centro">Centro</option>
              <option value="Bairro A">Bairro A</option>
              <option value="Bairro B">Bairro B</option>
              <option value="Zona Rural">Zona Rural</option>
            </select>

            <button
              onClick={handlePredizer}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Fazer Predição
            </button>

            {resultado && (
              <div className="mt-4 text-sm text-gray-800">
                <p><strong>Classe Predita:</strong> {resultado.classe_predita}</p>
                <p><strong>Probabilidades:</strong></p>
                <ul className="list-disc ml-4">
                  {Object.entries(resultado.probabilidades).map(([classe, prob]: any) => (
                    <li key={classe}>
                      {classe}: {(prob * 100).toFixed(2)}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Distribuição por Tipo de Caso</h2>
            {graficoPizza && <Pie data={graficoPizza} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded p-4">
              <h2 className="text-lg font-semibold mb-2">Coeficientes do Modelo</h2>
              <Bar data={graficoCoefs} />
            </div>

            <div className="bg-white rounded p-4">
              <h2 className="text-lg font-semibold mb-2">Acurácia por Tipo de Caso</h2>
              {graficoAcuracia && <Bar data={graficoAcuracia} />}
            </div>
          </div>

          <div className="bg-white rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Probabilidade por Faixa Etária</h2>
            <Line data={graficoProbIdade} />
          </div>

          <div className="bg-white rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Mapa de Localizações</h2>
            <Mapa pontos={localizacoes} />
          </div>
        </main>
      </div>
    </div>
  );

}
