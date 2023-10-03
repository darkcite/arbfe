<template>
  <div>
    <button v-if="!isAuthenticated" @click="loginWithMetaMask">
      <img src="@/assets/metamask-icon.svg" alt="MetaMask Logo" width="32">
      Login with MetaMask
    </button>
    <button v-if="!isAuthenticated" @click="loginWithWalletConnect">
      <img src="@/assets/walletconnect-logo.svg" alt="WalletConnect Logo" width="32">
      Login with WalletConnect
    </button>

    <div v-if="isAuthenticated">
      <div>
        <select v-model="selectedCountry">
          <option value="">Select starting currency</option>
          <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
        </select>

        <table v-if="selectedCountry && exchangeRates[selectedCountry]">
          <thead>
            <tr>
              <th>Child entity</th>
              <th>EUR</th>
              <th>USD</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="childEntity in Object.keys(exchangeRates[selectedCountry])" :key="childEntity">
              <td>{{ childEntity }}</td>
              <td v-if="exchangeRates[selectedCountry][childEntity]['EUR']">{{
                exchangeRates[selectedCountry][childEntity]['EUR'] }}</td>
              <td v-else>-</td>
              <td v-if="exchangeRates[selectedCountry][childEntity]['USD']">{{
                exchangeRates[selectedCountry][childEntity]['USD'] }}</td>
              <td v-else>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";

export default {
  name: 'App',

  data() {
    return {
      selectedCountry: '',
      countries: [],
      exchangeRates: {},
      isAuthenticated: false,
      web3: null,
    };
  },

  methods: {
    async loginWithWalletConnect() {
      try {
        const provider = new WalletConnectProvider({
          rpc: { 1: "https://mainnet.infura.io/v3/4f9c9233fa9e45a582f7883b3968e5f2" },  // replace YOUR_INFURA_PROJECT_ID
        });

        await provider.enable();

        this.web3 = new Web3(provider);

        const accounts = await this.web3.eth.getAccounts();

        if (accounts && accounts.length > 0) {
          this.isAuthenticated = true;
          // Optionally: Check if the connected account address has the right permissions on your backend
        }
      } catch (error) {
        if (error.message === "User closed modal") {
          // Handle the error, e.g., show a message or simply do nothing
          console.log("User closed the WalletConnect modal.");
        } else {
          // Handle other errors
          console.error("An error occurred:", error);
        }
      }
    },

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
      axios.get('https://us-central1-arbit-400006.cloudfunctions.net/get_sum')
        .then(response => response.data)
        .then(data => {
          this.countries = Object.keys(data);
          this.exchangeRates = data;
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
<style scoped>
body,
h1,
h2,
h3,
p,
button {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f5f5;
}

button {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px;
  padding: 8px 16px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #333;
}

table {
  margin-top: 20px;
  width: 80%;
  border-collapse: collapse;
}

thead {
  background: #333;
  color: #fff;
}

th,
td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}

tbody tr:hover {
  background: #eee;
}</style>