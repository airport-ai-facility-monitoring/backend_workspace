<template>
    <div>
        <Number
            label="CctvId"
            v-model="value.cctvId"
            :editMode="editMode"
        />
        <String
            label="CctvUrl"
            v-model="value.cctvUrl"
            :editMode="editMode"
        />
        <String
            label="CctvArea"
            v-model="value.cctvArea"
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
    name: 'Cctv',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "cctvs",
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
