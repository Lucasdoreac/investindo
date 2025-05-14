import { Stack } from 'expo-router';

/**
 * Layout raiz do aplicativo Investindo com Sabedoria
 * Configuração do Stack Navigator principal
 */
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="calculadora/juros-compostos" 
        options={{ 
          title: "Calculadora de Juros Compostos",
          presentation: "modal",
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="calculadora/comparador" 
        options={{ 
          title: "Comparador de Investimentos",
          presentation: "modal",
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="calculadora/escada-vencimentos" 
        options={{ 
          title: "Escada de Vencimentos",
          presentation: "modal",
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
    </Stack>
  );
}
