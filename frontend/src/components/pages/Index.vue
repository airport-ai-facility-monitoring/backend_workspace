<template>
  <v-container fluid>
    <v-row>
      <v-card
          v-for="(card, index) in cards"
          :key="index"
          class="mx-auto"
          style="height:300px; width:300px; margin-bottom:20px;"
          outlined
      >
        <v-list-item>
          <v-icon style="margin-top: 30%; margin-left: 37.5%;" color="primary" size="64">mdi-apps</v-icon>
        </v-list-item>
        <v-card-actions>
          <v-btn
              class="mx-auto"
              outlined
              rounded
              :to="card.link"
              style="font-weight:500; font-size:20px; border:solid 2px; max-width:250px; overflow:hidden; margin-top: 10%;"
          >
              {{ card.text }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Index',
  data: () => ({
    cards: [
      {
          text: "회원가입",
          link: "/users",
      },
      {
          text: "직원",
          link: "/employees",
      },
      {
          text: "공지사항",
          link: "/notifications",
      },
      {
          text: "알림",
          link: "/alerts",
      },
      {
          text: "CCTV",
          link: "/cctvs",
      },
      {
          text: "이상 객체",
          link: "/strangeObjects",
      },
      {
          text: "작업자",
          link: "/workers",
      },
      {
          text: "조업차량",
          link: "/workTrucks",
      },
      {
          text: "활주로 손상",
          link: "/runwayCracks",
      },
      {
          text: "손상 보고서",
          link: "/runwayCrackReports",
      },
      {
          text: "장비 보고서",
          link: "/equipmentReports",
      },
      {
          text: "장비",
          link: "/equipment",
      },
    ],
  }),
};
</script>
