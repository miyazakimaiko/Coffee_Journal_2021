import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const labels = ['Waltz Blend', 'Tropical Blend', 'Su Nolag', 'April', 'Ethopian heirloom', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: 'rgb(243,187,69)',
      backgroundColor: 'rgba(243,187,69, 0.5)',
    }
  ],
};

const ChartBarBeans = () => {
  return (
    <div className="px-3 w-1/2">
      <div
        className="
          w-full p-4
          bg-white shadow-sm rounded-md"
    >
        <h3 className="font-medium text-lg text-center pb-2">
          <strong>Beans</strong> Overall Rate TOP 10
        </h3>
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}

export default ChartBarBeans
