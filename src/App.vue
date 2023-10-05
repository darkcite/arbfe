<template>
  <div class="container">
    <button v-if="!isAuthenticated" @click="loginWithMetaMask">
      <img src="@/assets/metamask-icon.svg" alt="MetaMask Logo" width="32">
      Login with MetaMask
    </button>

    <!-- Spinner while loading data -->
    <div v-if="isFetchingData" class="loader"></div>

    <div v-if="isAuthenticated && !isFetchingData && Object.keys(arbitrageData).length">
      <table>
        <thead>
          <tr>
            <th>Fiat Buy</th>
            <th>Buy Bank</th>
            <th>Buy Price</th>
            <th>>USDT></th>
            <th>Fiat Sell</th>
            <th>Sell Bank</th>
            <th>Sell Price</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="fiat in Object.keys(arbitrageData)">
            <tr v-for="(entry, index) in Object.values(arbitrageData[fiat])" :key="index">
              <td>{{ entry.fiat_buy }}</td>
              <td>{{ entry.buy_bank }}</td>
              <td>{{ entry.buy_price }}</td>
              <td>>USDT></td>
              <td>{{ entry.fiat_sell }}</td>
              <td>{{ entry.sell_bank }}</td>
              <td>{{ entry.sell_price }}</td>
              <td>{{ entry.percentage_difference_usd }}%</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import Web3 from 'web3';

export default {
  name: 'App',

  data() {
    return {
      arbitrageData: {},
      isAuthenticated: false,
      web3: null,
      isFetchingData: false // New property to track data fetching
    };
  },

  methods: {
    async loginWithMetaMask() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          this.web3 = new Web3(window.ethereum);
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            this.isAuthenticated = true;
            this.fetchData();
          }
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        alert('MetaMask not detected');
      }
    },

    fetchData() {
      this.isFetchingData = true; // Set to true before starting the request
      axios.get('https://us-central1-arbit-400006.cloudfunctions.net/get_arbitrage_data')
        .then(response => response.data)
        .then(data => {
          this.arbitrageData = data;
        })
        .finally(() => {
          this.isFetchingData = false; // Set to false once request is complete
        });
    },
  },

  mounted() {
    if (this.isAuthenticated) {
      this.fetchData();
    }
  },
};
</script>

<style>
/* Global styles */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #121212;
  /* Dark background */
  color: #c5c5c5;
  /* Light gray text color for better visibility on dark background */
}

/* Resetting defaults */
h1,
h2,
h3,
p,
button,
table,
th,
td {
  margin: 0;
  padding: 0;
  font-family: 'Courier New', Courier, monospace;
  /* Classic hacker font */
  border: none;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  /* This ensures the container takes up the full viewport height */
  background-color: #121212;
  /* Set dark background for container as well */
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #0f0; /* Green color to match the theme */
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #333;
  color: #0f0;
  /* Classic green text */
  border: 1px solid #0f0;
  /* Green border */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

button:hover {
  background-color: #555;
  transform: scale(1.05);
  /* Slightly enlarge the button on hover */
}

table {
  margin-top: 20px;
  width: 80%;
  border-collapse: collapse;
  box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.4);
  /* Greenish shadow */
}

thead {
  background-color: #222;
  /* Slightly lighter than the background */
}

th,
td {
  padding: 10px 15px;
  border-bottom: 1px solid #0f0;
  /* Green borders */
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: #1e1e1e;
  /* A shade lighter on hover */
}</style>


