<template>
    <div>
        <Number
            label="ObjId"
            v-model="value.objId"
            :editMode="editMode"
        />
        <Number
            label="ObjectType"
            v-model="value.objectType"
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
    name: 'StrangeObject',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "strangeObjects",
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
