<script>
import Api from '../services/Api';

export default {
  props: {
    show: Boolean,
    id: Number,
    username: String,
  },
  data() {
    return {
      newUsername: this.username,
    };
  },
  methods: {
    async createClient() {
      const response = await Api.updateUsername(this.id, this.newUsername);
      if (response) {
        this.$emit('newClient', response);
        this.$emit('closeModal');
      }
    },
  },
  watch: {
    show(opened) {
      if (opened) {
        this.newUsername = this.username;
      }
    },
  },
};
</script>
<template>
  <!-- Put this part before </body> tag -->
  <label class="modal cursor-pointer" :class="{ 'modal-open': show }">
    <label
      class="modal-box relative flex flex-col justify-center items-center"
      for=""
    >
      <h3 class="text-lg font-bold self-start">Update client username</h3>
      <div class="form-control w-full max-w-xs mt-5">
        <label class="label">
          <span class="label-text">Username</span>
        </label>
        <input
          type="text"
          v-model="newUsername"
          placeholder="..."
          class="input input-bordered"
        />
      </div>
      <div class="modal-action self-end">
        <button @click="$emit('closeModal')" class="btn btn-error">
          Cancel
        </button>
        <button @click="createClient" class="btn btn-success">Update</button>
      </div>
    </label>
  </label>
</template>
