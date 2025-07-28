<template>
    <div>
        <Number
            label="NotificationsId"
            v-model="value.notificationsId"
            :editMode="editMode"
        />
        <String
            label="Title"
            v-model="value.title"
            :editMode="editMode"
        />
        <Number
            label="WriterId"
            v-model="value.writerId"
            :editMode="editMode"
        />
        <String
            label="Contents"
            v-model="value.contents"
            :editMode="editMode"
        />
        <Date
            label="WriteDate"
            v-model="value.writeDate"
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
    name: 'Notification',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "notifications",
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
