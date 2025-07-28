<template>
    <div>
        <Number
            label="EmployeeId"
            v-model="value.employeeId"
            :editMode="editMode"
        />
        <String
            label="Name"
            v-model="value.name"
            :editMode="editMode"
        />
        <String
            label="Department"
            v-model="value.department"
            :editMode="editMode"
        />
        <String
            label="Position"
            v-model="value.position"
            :editMode="editMode"
        />
        <Date
            label="HireDate"
            v-model="value.hireDate"
            :editMode="editMode"
        />
        <String
            label="PhoneNumber"
            v-model="value.phoneNumber"
            :editMode="editMode"
        />
        <String
            label="Email"
            v-model="value.email"
            :editMode="editMode"
        />
        <v-row class="ma-0 pa-0">
            <v-spacer></v-spacer>
            <v-btn width="64px" color="primary" @click="save">
                저장
            </v-btn>
        </v-row>
    </div>
</template>


<script>
import BaseEntity from './base-ui/BaseEntity.vue'

export default {
    name: 'Employee',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "employees",
        value: {
        }
    }),
    created(){
    },
    computed:{
    },
    methods: {
    },
}
</script>
