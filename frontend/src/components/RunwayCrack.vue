<template>
    <div>
        <Number
            label="RcId"
            v-model="value.rcId"
            :editMode="editMode"
        />
        <String
            label="ImageUrl"
            v-model="value.imageUrl"
            :editMode="editMode"
        />
        <Number
            label="CctvId"
            v-model="value.cctvId"
            :editMode="editMode"
        />
        <Number
            label="Size"
            v-model="value.size"
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
    name: 'RunwayCrack',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "runwayCracks",
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
