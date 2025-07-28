<template>
    <div>
        <Number
            label="RcReportid"
            v-model="value.rcReportid"
            :editMode="editMode"
        />
        <String
            label="Title"
            v-model="value.title"
            :editMode="editMode"
        />
        <Number
            label="RepairPeriod"
            v-model="value.repairPeriod"
            :editMode="editMode"
        />
        <Number
            label="RepairCost"
            v-model="value.repairCost"
            :editMode="editMode"
        />
        <String
            label="Cause"
            v-model="value.cause"
            :editMode="editMode"
        />
        <String
            label="ReportContents"
            v-model="value.reportContents"
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
    name: 'RunwayCrackReport',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "runwayCrackReports",
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
