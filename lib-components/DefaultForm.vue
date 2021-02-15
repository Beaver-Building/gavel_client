<template>
    <v-container>
        <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-select
      v-model="select"
      :items="items"
      :rules="[v => !!v || 'Item is required']"
      label="Process Kind"
      required
    ></v-select>
    
    <v-text-field
      v-model="name"
      :counter="20"
      :rules="nameRules"
      label="Engineer Name"
      required
    ></v-text-field>

    <v-checkbox
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Once the process is initiated, it can't be caneled. Do you confirm keep going?"
      required
    ></v-checkbox>

    <v-btn
      :disabled="!valid"
      color="primary"
      class="mr-4"
      @click="validate; newProcess"
    >
      Submit
    </v-btn>

    <v-btn
      color="primary"
      class="mr-4"
      @click="reset"
    >
      Reset Form
    </v-btn>

    <v-btn
      color="warning"
      @click="resetValidation"
    >
      Reset Validation
    </v-btn>
  </v-form>
    </v-container>
</template>
<script>
export default {
    data: () => ({
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      items: [
        'SEE Escalation',
        'EE Escalation',
        'Other',
      ],
      checkbox: false,
    }),
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
      
    },
}
</script>