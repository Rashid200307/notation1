import React, { useState, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const BigOVisualization = () => {
  const [maxN, setMaxN] = useState(20);
  const [selectedComplexity, setSelectedComplexity] = useState('O(n²)');
  const [viewMode, setViewMode] = useState('growth');
  const [showComplexities, setShowComplexities] = useState({
    constant: true,
    logarithmic: true,
    linear: true,
    nlogn: true,
    quadratic: true,
    cubic: false,
    exponential: false
  });

  // Robust complexity definitions with error handling
  const complexityFunctions = useMemo(() => ({
    'O(1)': {
      fn: (n) => 1,
      formula: 'f(n) = 1',
      explanation: 'Constant time - always exactly 1 operation',
      mathProof: 'For any n ≥ 1: f(n) = 1 ≤ c·1 where c = 1',
      color: '#8884d8',
      example: 'Array access: arr[0]',
      realCode: 'return array[0];',
      speed: '⚡ Constant',
      category: 'Excellent'
    },
    'O(log n)': {
      fn: (n) => n <= 1 ? 0 : Math.log2(n),
      formula: 'f(n) = log₂(n)',
      explanation: 'Logarithmic - cuts problem in half each step',
      mathProof: 'Binary search: T(n) = T(n/2) + 1 = O(log n)',
      color: '#82ca9d',
      example: 'Binary search in sorted array',
      realCode: 'while(left <= right) mid = (left+right)/2;',
      speed: '🚀 Logarithmic',
      category: 'Excellent'
    },
    'O(n)': {
      fn: (n) => n,
      formula: 'f(n) = n',
      explanation: 'Linear - operations grow with input size',
      mathProof: 'Single loop: Σᵢ₌₁ⁿ 1 = n',
      color: '#ffc658',
      example: 'Linear search through array',
      realCode: 'for(i=0; i<n; i++) check(arr[i]);',
      speed: '🏃 Linear',
      category: 'Good'
    },
    'O(n log n)': {
      fn: (n) => n <= 1 ? 0 : n * Math.log2(n),
      formula: 'f(n) = n × log₂(n)',
      explanation: 'Linearithmic - divide & conquer algorithms',
      mathProof: 'Merge sort: T(n) = 2T(n/2) + n = O(n log n)',
      color: '#ff7c7c',
      example: 'Merge sort, heap sort',
      realCode: 'mergeSort(left); mergeSort(right); merge();',
      speed: '🚶 Linearithmic',
      category: 'Good'
    },
    'O(n²)': {
      fn: (n) => n * n,
      formula: 'f(n) = n²',
      explanation: 'Quadratic - nested loops',
      mathProof: 'Nested loops: Σᵢ₌₁ⁿ Σⱼ₌₁ⁿ 1 = n²',
      color: '#8dd1e1',
      example: 'Bubble sort, nested loops',
      realCode: 'for(i=0;i<n;i++) for(j=0;j<n;j++) compare();',
      speed: '🐌 Quadratic',
      category: 'Slow'
    },
    'O(n³)': {
      fn: (n) => n * n * n,
      formula: 'f(n) = n³',
      explanation: 'Cubic - triple nested operations',
      mathProof: 'Triple loops: Σᵢ₌₁ⁿ Σⱼ₌₁ⁿ Σₖ₌₁ⁿ 1 = n³',
      color: '#d084d0',
      example: 'Matrix multiplication (naive)',
      realCode: 'for(i<n) for(j<n) for(k<n) C[i][j]+=A[i][k]*B[k][j];',
      speed: '🦕 Cubic',
      category: 'Very Slow'
    },
    'O(2ⁿ)': {
      fn: (n) => n > 30 ? Math.pow(2, 30) : Math.pow(2, n),
      formula: 'f(n) = 2ⁿ',
      explanation: 'Exponential - doubles with each input',
      mathProof: 'Recursive tree: each call branches into 2 more',
      color: '#ffb347',
      example: 'Tower of Hanoi, naive Fibonacci',
      realCode: 'fib(n-1) + fib(n-2); // Exponential branches',
      speed: '🐢 Exponential',
      category: 'Terrible'
    }
  }), []);

  // Key mapping
  const keyMapping = {
    'O(1)': 'constant',
    'O(log n)': 'logarithmic', 
    'O(n)': 'linear',
    'O(n log n)': 'nlogn',
    'O(n²)': 'quadratic',
    'O(n³)': 'cubic',
    'O(2ⁿ)': 'exponential'
  };

  const reverseKeyMapping = {};
  Object.entries(keyMapping).forEach(([complexity, key]) => {
    reverseKeyMapping[key] = complexity;
  });

  // Generate chart data
  const data = useMemo(() => {
    const result = [];
    const validMaxN = Math.min(Math.max(maxN, 1), 100);
    
    for (let n = 1; n <= validMaxN; n++) {
      const point = { n };
      Object.entries(complexityFunctions).forEach(([name, info]) => {
        const value = info.fn(n);
        point[name] = isFinite(value) ? value : 0;
      });
      result.push(point);
    }
    return result;
  }, [maxN, complexityFunctions]);

  // Get visible complexity lines
  const getVisibleLines = useCallback(() => {
    return Object.entries(showComplexities)
      .filter(([key, visible]) => visible && reverseKeyMapping[key])
      .map(([key]) => reverseKeyMapping[key]);
  }, [showComplexities, reverseKeyMapping]);

  // Mathematical analysis view
  const renderMathematicalAnalysis = () => {
    const info = complexityFunctions[selectedComplexity];
    if (!info) return <div>Invalid complexity selected</div>;

    const values = [];
    for (let n = 1; n <= Math.min(maxN, 15); n++) {
      values.push({
        n,
        value: info.fn(n)
      });
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Mathematical Analysis: {selectedComplexity}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">Formula & Proof</h4>
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                <p className="font-mono text-lg mb-2">{info.formula}</p>
                <p className="text-sm text-gray-600 mb-2">{info.explanation}</p>
                <p className="text-xs text-blue-700 font-medium">{info.mathProof}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">Implementation</h4>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                <p className="text-sm mb-2 font-medium">{info.example}</p>
                <code className="text-xs text-gray-700 block bg-gray-100 p-2 rounded">
                  {info.realCode}
                </code>
                <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
                  info.category === 'Excellent' ? 'bg-green-100 text-green-700' :
                  info.category === 'Good' ? 'bg-blue-100 text-blue-700' :
                  info.category === 'Slow' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {info.speed} - {info.category}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h4 className="font-semibold mb-3 text-gray-700">Step-by-Step Calculations</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">n</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expression</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {values.slice(0, 10).map((item, idx) => (
                  <tr key={item.n} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm font-medium">{item.n}</td>
                    <td className="px-4 py-3 font-mono text-sm">
                      {selectedComplexity === 'O(1)' && '1'}
                      {selectedComplexity === 'O(log n)' && `log₂(${item.n})`}
                      {selectedComplexity === 'O(n)' && `${item.n}`}
                      {selectedComplexity === 'O(n log n)' && `${item.n} × log₂(${item.n})`}
                      {selectedComplexity === 'O(n²)' && `${item.n}²`}
                      {selectedComplexity === 'O(n³)' && `${item.n}³`}
                      {selectedComplexity === 'O(2ⁿ)' && `2^${item.n}`}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">
                      {item.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {idx > 0 && values[idx-1] && values[idx-1].value > 0 ? 
                        `×${(item.value / values[idx-1].value).toFixed(2)}` : 
                        'baseline'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Comparison view
  const renderComparison = () => {
    const visibleLines = getVisibleLines();
    if (visibleLines.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">Please select at least one complexity to compare.</p>
        </div>
      );
    }

    const comparisonData = [5, 10, 20, 50, Math.min(100, maxN)].map(n => {
      const point = { n: `n=${n}` };
      visibleLines.forEach(complexity => {
        const info = complexityFunctions[complexity];
        if (info) {
          point[complexity] = info.fn(n);
        }
      });
      return point;
    });

    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="n" />
            <YAxis scale="log" domain={[1, 'auto']} />
            <Tooltip formatter={(value) => [value.toLocaleString(), 'operations']} />
            <Legend />
            {visibleLines.map(complexity => (
              <Bar
                key={complexity}
                dataKey={complexity}
                fill={complexityFunctions[complexity].color}
                opacity={0.8}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Note:</strong> Y-axis uses logarithmic scale for clear comparison.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        📊 Big-O Notation: Mathematical Analysis
      </h1>
      
      <div className="mb-6 bg-white rounded-lg p-6 shadow-md">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="font-medium text-gray-600 block mb-2">Analysis Mode:</label>
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="growth">📈 Growth Visualization</option>
              <option value="comparison">📊 Performance Comparison</option>
              <option value="mathematical">🧮 Mathematical Analysis</option>
            </select>
          </div>
          
          <div>
            <label className="font-medium text-gray-600 block mb-2">
              Input Size (n): {maxN}
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={maxN}
              onChange={(e) => setMaxN(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span>
              <span>100</span>
            </div>
          </div>
          
          {viewMode === 'mathematical' && (
            <div>
              <label className="font-medium text-gray-600 block mb-2">Analyze Function:</label>
              <select 
                value={selectedComplexity} 
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(complexityFunctions).map(complexity => (
                  <option key={complexity} value={complexity}>{complexity}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {viewMode !== 'mathematical' && (
          <div>
            <h3 className="font-medium text-gray-600 mb-3">Select Complexities:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(complexityFunctions).map(([complexity, info]) => {
                const key = keyMapping[complexity];
                
                return (
                  <label key={complexity} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={showComplexities[key] || false}
                      onChange={(e) => setShowComplexities(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded"
                    />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: info.color }}></div>
                    <span className="font-mono text-sm font-medium">{complexity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {viewMode === 'growth' && (
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Growth Rate Visualization</h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="n" 
                stroke="#666"
                label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -40 }}
              />
              <YAxis 
                stroke="#666"
                label={{ value: 'Operations', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value.toLocaleString()} operations`, name]}
                labelFormatter={(label) => `Input size: ${label}`}
              />
              <Legend />
              {getVisibleLines().map((complexity) => (
                <Line
                  key={complexity}
                  type="monotone"
                  dataKey={complexity}
                  stroke={complexityFunctions[complexity].color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {viewMode === 'comparison' && renderComparison()}
      {viewMode === 'mathematical' && renderMathematicalAnalysis()}

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">🎯 Efficiency Guide</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
              <strong className="text-green-700">Excellent:</strong> O(1), O(log n)
            </div>
            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
              <strong className="text-blue-700">Good:</strong> O(n), O(n log n)
            </div>
            <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
              <strong className="text-yellow-700">Acceptable:</strong> O(n²)
            </div>
            <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
              <strong className="text-red-700">Avoid:</strong> O(n³), O(2ⁿ)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">📈 Real Scale Impact</h3>
          <div className="text-sm space-y-2">
            <p><strong>For n = 1,000:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>O(n): 1,000 ops ✅</li>
              <li>O(n log n): ~10,000 ops ✅</li>
              <li>O(n²): 1,000,000 ops ⚠️</li>
              <li>O(2ⁿ): Impossible! ❌</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">🧮 Big-O Definition</h3>
          <div className="text-sm">
            <p className="font-medium mb-2">Mathematical Definition:</p>
            <p className="font-mono text-xs bg-gray-100 p-2 rounded">
              {`f(n) = O(g(n)) if ∃ c, n₀ > 0 such that f(n) ≤ c·g(n) for all n ≥ n₀`}
            </p>
            <p className="mt-2 text-xs text-gray-600">
              Translation: Your algorithm will never be slower than this upper bound for large inputs.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">💡 Key Insights</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Constants don't matter:</strong> O(2n) = O(n)</li>
          <li>• <strong>Largest term wins:</strong> O(n² + n + 5) = O(n²)</li>
          <li>• <strong>Think worst-case:</strong> Big-O describes the upper limit</li>
          <li>• <strong>Choose algorithms wisely:</strong> Small improvements in complexity = huge performance gains</li>
        </ul>
      </div>
    </div>
  );
};

export default BigOVisualization;
