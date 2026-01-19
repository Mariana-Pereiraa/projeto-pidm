import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.SPOONACULAR_API_KEY;

console.log('API KEY NO SERVICE:', API_KEY);


const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function buscarReceitasPorIngredientes(
  ingredientes: string[]
) {
  const ingredientesQuery = ingredientes.join(',');

  const response = await fetch(
    `${BASE_URL}/findByIngredients?ingredients=${ingredientesQuery}&number=10&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar receitas');
  }

  return response.json();
}

export async function buscarDetalhesReceita(id: number) {
    const response = await fetch(
      `${BASE_URL}/${id}/information?apiKey=${API_KEY}`
    );
  
    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes');
    }
  
    return response.json();
  }