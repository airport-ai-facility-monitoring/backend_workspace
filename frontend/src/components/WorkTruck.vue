<template>
    <div>
        <Number
            label="WorkTruckId"
            v-model="value.workTruckId"
            :editMode="editMode"
        />
        <Number
            label="WorkTruckType"
            v-model="value.workTruckType"
            :editMode="editMode"
        />
        <Date
            label="WorkStartTime"
            v-model="value.workStartTime"
            :editMode="editMode"
        />
        <Date
            label="WorkEndTime"
            v-model="value.workEndTime"
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
    name: 'WorkTruck',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "workTrucks",
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
