<!-- eslint-disable no-param-reassign -->
<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import Api from '../../services/Api';
import CreateClient from '../../components/CreateClient.vue';
import UpdateClientUsername from '../../components/UpdateClientUsername.vue';

export default {
  components: { CreateClient, UpdateClientUsername },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  watch: {
    theme(newVal) {
      this.options = {
        chart: {
          background: '0',
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        theme: {
          mode: newVal,
          pallete: 'pallete3',
        },
      };
    },
    orderBy(sortType) {
      this.sortClients(sortType);
    },
  },
  data() {
    return {
      orderBy: 'last_seen',
      isRefreshing: false,
      showCreateModal: false,
      showUsernameModal: false,
      clientToEdit: { username: '', id: 0 },
      clients: [],
      options: {
        chart: {
          background: '0',
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        theme: {
          mode: 'light',
          pallete: 'pallete3',
        },
      },
      series: [
        {
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
      donutSeries: [44, 55, 41, 17, 15],
    };
  },
  methods: {
    sortClients(sortType) {
      this.clients.sort((a, b) => {
        if (sortType === 'last_seen' || sortType === 'created') {
          if (moment(a[sortType]).isBefore(moment(b[sortType]))) {
            return 1;
          }
          if (moment(a[sortType]).isAfter(moment(b[sortType]))) {
            return -1;
          }
          return 0;
        }
        if (a[sortType] < b[sortType]) {
          return -1;
        }
        if (a[sortType] > b[sortType]) {
          return 1;
        }
        return 0;
      });
    },
    async refresh() {
      this.isRefreshing = true;
      this.clients = [];
      await this.loadClients();
      this.isRefreshing = false;
    },
    appendClient(client) {
      client.created_view = moment(client.created).fromNow();
      client.last_seen_view = moment(client.last_seen).fromNow();
      this.clients.unshift(client);
    },
    updateClient(client) {
      this.clients.forEach((c) => {
        if (c.id === client.id) {
          c.username = client.username;
        }
      });
    },
    async loadClients() {
      this.clients = await Api.getClients();
      this.clients.forEach((client) => {
        client.created_view = moment(client.created).fromNow();
        if (client.last_seen) {
          client.last_seen_view = moment(client.last_seen).fromNow();
        } else {
          client.last_seen = moment('1970-01-01');
          client.last_seen_view = moment(client.last_seen).fromNow();
        }
      });
      this.sortClients(this.orderBy);
    },
    async changeUsername(id, username) {
      this.clientToEdit = { id, username };
      this.showUsernameModal = true;
    },
    async changeClientStatus(clientId) {
      this.clients.forEach(async (client) => {
        if (client.id === clientId) {
          client = await Api.updateClientStatus(clientId, !client.status);
          client.created_view = moment(client.created).fromNow();
          client.last_seen_view = moment(client.last_seen).fromNow();
        }
      });
    },
    async copyKey(key) {
      await navigator.clipboard.writeText(key);
    },
    toggleUsernameModal() {
      this.showUsernameModal = !this.showUsernameModal;
    },
    toggleClientModal() {
      this.showCreateModal = !this.showCreateModal;
    },
  },
  mounted() {
    this.loadClients();
    this.options.theme.mode = this.theme;
  },
};
</script>
<template>
  <CreateClient
    :show="this.showCreateModal"
    @close-modal="toggleClientModal"
    @new-client="appendClient"
  />
  <UpdateClientUsername
    v-bind="this.clientToEdit"
    :show="this.showUsernameModal"
    @close-modal="toggleUsernameModal"
    @new-client="updateClient"
  />
  <div
    class="flex flex-col w-full xl:flex-wrap xl:justify-center justify-start mt-4 h-max overflow-y-auto"
  >
    <div class="flex self-end mr-5 gap-2">
      <div class="form-control w-full max-w-xs">
        <select v-model="orderBy" class="select select-bordered">
          <option selected value="last_seen">Last seen</option>
          <option value="created">Created</option>
          <option value="uuid">UUID</option>
          <option value="name">Name</option>
          <option value="key">Key</option>
        </select>
      </div>
      <button
        type="button"
        @click="refresh"
        :class="{ 'loading btn-disabled': isRefreshing }"
        class="btn btn-info"
      >
        Refresh
      </button>
      <button type="button" @click="toggleClientModal" class="btn btn-primary">
        New client
      </button>
    </div>
    <div
      class="overflow-x-auto w-full max-w-5xl p-2 self-center"
      v-if="clients.length > 0"
    >
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th class="relative">KEY</th>
            <th>Name</th>
            <th>UUID</th>
            <th>Created</th>
            <th>Last seen</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <th class="cursor-pointer" @click="copyKey(client.key)">
              <div class="tooltip" data-tip="Copy">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              {{ client.key }}
            </th>
            <th>
              <div
                class="flex gap-1"
                @click="changeUsername(client.id, client.username)"
              >
                {{ client.username }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
            </th>
            <th @click="copyKey(client.uuid)">
              <div class="tooltip" data-tip="Copy">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              {{ client.uuid ? client.uuid.substring(0, 13) + '...' : '' }}
            </th>
            <th>{{ client.created_view }}</th>
            <th>{{ client.last_seen_view }}</th>
            <th>
              <input
                type="checkbox"
                class="toggle"
                :checked="client.is_active"
                @change="changeClientStatus(client.id)"
              />
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <span v-else class="text-xl"> Loading... </span>
    <!-- <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Your investments</span>
      <apexchart
        width="380"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Mining stats</span>
      <apexchart
        width="380"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>

    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Actives in markets</span>
      <apexchart
        width="380"
        type="donut"
        :options="options"
        :series="donutSeries"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Your investments</span>
      <apexchart
        width="380"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Mining stats</span>
      <apexchart
        width="380"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>

    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Actives in markets</span>
      <apexchart
        width="380"
        type="donut"
        :options="options"
        :series="donutSeries"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Your investments</span>
      <apexchart
        width="380"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Mining stats</span>
      <apexchart
        width="380"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>

    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Actives in markets</span>
      <apexchart
        width="380"
        type="donut"
        :options="options"
        :series="donutSeries"
      ></apexchart>
    </div> -->
  </div>
</template>
<style></style>
