<template>
    <div>
        <Number
            label="WorkerId"
            v-model="value.workerId"
            :editMode="editMode"
        />
        <String
            label="WorkArea"
            v-model="value.workArea"
            :editMode="editMode"
        />
        <Number
            label="ApprovalWorkerCount"
            v-model="value.approvalWorkerCount"
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
    name: 'Worker',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "workers",
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
