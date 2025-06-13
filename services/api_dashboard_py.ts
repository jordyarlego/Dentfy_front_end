const BASE_URL = "http://localhost:5000/api";

type filtros = {
  sexo?: string;
  etnia?: string;
  idadeMin?: number;
  idadeMax?: number;
  dataInicio?: string;
  dataFim?: string;
};


export async function buscarCasos() {
  const res = await fetch(`${BASE_URL}/casos`);
  if (!res.ok) throw new Error("Erro ao buscar casos");
  return res.json();
}

export async function buscarCoeficientes() {
  const res = await fetch(`${BASE_URL}/modelo/coefs`);
  if (!res.ok) throw new Error("Erro ao buscar coeficientes do modelo");
  return res.json();
}

export async function buscarCorrelacoes() {
  const res = await fetch(`${BASE_URL}/modelo/correlacoes`);
  if (!res.ok) throw new Error("Erro ao buscar correlações");
  return res.json();
}

export async function buscarAcuracia(filtros: any = {}) {
  const queryParams = new URLSearchParams();

  if (filtros.sexo && filtros.sexo !== 'todos') queryParams.append('sexo', filtros.sexo);
  if (filtros.etnia && filtros.etnia !== 'todos') queryParams.append('etnia', filtros.etnia);
  if (filtros.idadeMin != null) queryParams.append('idadeMin', filtros.idadeMin);
  if (filtros.idadeMax != null) queryParams.append('idadeMax', filtros.idadeMax);
  if (filtros.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) queryParams.append('dataFim', filtros.dataFim);

  const query = queryParams.toString();
  const res = await fetch(`http://localhost:5000/api/modelo/acuracia?${query}`);
  if (!res.ok) throw new Error('Erro ao buscar acurácia');
  return res.json();
}

export async function buscarProbabilidadePorIdade(filtros: any = {}) {
  const queryParams = new URLSearchParams();

  if (filtros.sexo && filtros.sexo !== 'todos') queryParams.append('sexo', filtros.sexo);
  if (filtros.etnia && filtros.etnia !== 'todos') queryParams.append('etnia', filtros.etnia);
  if (filtros.idadeMin != null) queryParams.append('idadeMin', filtros.idadeMin);
  if (filtros.idadeMax != null) queryParams.append('idadeMax', filtros.idadeMax);
  if (filtros.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) queryParams.append('dataFim', filtros.dataFim);

  const query = queryParams.toString();
  const res = await fetch(`http://localhost:5000/api/modelo/probabilidade-idade?${query}`);
  if (!res.ok) throw new Error('Erro ao buscar probabilidades por idade');
  return res.json();
}

type Filtros = {
  sexo?: string;
  etnia?: string;
  idadeMin?: number;
  idadeMax?: number;
  dataInicio?: string;
  dataFim?: string;
};

export async function buscarLocalizacoes(filtros: Filtros = {}) {
  const queryParams = new URLSearchParams();

  if (filtros.sexo && filtros.sexo !== 'todos') queryParams.append('sexo', filtros.sexo);
  if (filtros.etnia && filtros.etnia !== 'todos') queryParams.append('etnia', filtros.etnia);
  if (filtros.idadeMin != null) queryParams.append('idadeMin', String(filtros.idadeMin));
  if (filtros.idadeMax != null) queryParams.append('idadeMax', String(filtros.idadeMax));
  if (filtros.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) queryParams.append('dataFim', filtros.dataFim);

  const query = queryParams.toString();
  const res = await fetch(`http://localhost:5000/api/stats/localizacoes?${query}`);
  if (!res.ok) throw new Error("Erro ao buscar localizações");
  return res.json();
}

export async function buscarDistribuicaoTipos(filtros: Filtros = {}) {
  const queryParams = new URLSearchParams();

  if (filtros.sexo && filtros.sexo !== 'todos') queryParams.append('sexo', filtros.sexo);
  if (filtros.etnia && filtros.etnia !== 'todos') queryParams.append('etnia', filtros.etnia);
  if (filtros.idadeMin != null) queryParams.append('idadeMin', String(filtros.idadeMin));
  if (filtros.idadeMax != null) queryParams.append('idadeMax', String(filtros.idadeMax));
  if (filtros.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) queryParams.append('dataFim', filtros.dataFim);

  const query = queryParams.toString();
  const res = await fetch(`${BASE_URL}/stats/pizza-tipo?${query}`);
  if (!res.ok) throw new Error('Erro ao buscar distribuição por tipo de caso');
  return res.json(); // formato: { "Furto": 5, "Assalto": 3, ... }
}

export async function fazerPredicao(dados: {
  idade: number;
  etnia: string;
  localizacao: string;
}) {
  const res = await fetch("http://localhost:5000/api/predizer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!res.ok) throw new Error("Erro ao fazer predição");
  return res.json();
}