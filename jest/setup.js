// Arquivo de setup para o Jest
import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Simular objetos globais
global.window = {};

// Mock para FontAwesome
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const View = require('react-native').View;
  return {
    FontAwesome: function(props) {
      return React.createElement(View, props);
    }
  };
});

// Mock para react-native-chart-kit
jest.mock('react-native-chart-kit', () => {
  const React = require('react');
  const View = require('react-native').View;
  return {
    LineChart: function() {
      return React.createElement(View, {}, []);
    },
    BarChart: function() {
      return React.createElement(View, {}, []);
    },
    PieChart: function() {
      return React.createElement(View, {}, []);
    }
  };
});

// Mock para react-native/Libraries/Animated/NativeAnimatedHelper
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => {
  return {
    addListener: jest.fn(),
    removeListeners: jest.fn()
  };
});

// Mock para a funções de dimensão
jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  
  ReactNative.Dimensions.get = jest.fn().mockReturnValue({
    width: 375,
    height: 667
  });
  
  return ReactNative;
});
