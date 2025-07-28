<template>
    <div>
        <Number
            label="AlertId"
            v-model="value.alertId"
            :editMode="editMode"
        />
        <String
            label="AlertLog"
            v-model="value.alertLog"
            :editMode="editMode"
        />
        <Date
            label="AlertDate"
            v-model="value.alertDate"
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
    name: 'Alert',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "alerts",
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
