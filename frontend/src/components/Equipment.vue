<template>
    <div>
        <Number
            label="EquipmentId"
            v-model="value.equipmentId"
            :editMode="editMode"
        />
        <String
            label="EquipmentType"
            v-model="value.equipmentType"
            :editMode="editMode"
        />
        <String
            label="EquipmentName"
            v-model="value.equipmentName"
            :editMode="editMode"
        />
        <String
            label="State"
            v-model="value.state"
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
    name: 'Equipment',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "equipment",
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
