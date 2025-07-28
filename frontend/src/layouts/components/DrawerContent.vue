<script setup>
import {
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts'
</script>

<template>
    <ul>
        <VerticalNavSectionTitle :item="{ heading: 'Member' }" />
        <VerticalNavLink
            :item="{
                title: '회원가입',
                to: '/users',
            }"
        />
        <VerticalNavLink
            :item="{
                title: '직원',
                to: '/employees',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '공지사항 관리' }" />
        <VerticalNavLink
            :item="{
                title: '공지사항',
                to: '/notifications',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '알림 관리' }" />
        <VerticalNavLink
            :item="{
                title: '알림',
                to: '/alerts',
            }"
        />
        <VerticalNavLink
            :item="{
                title: 'CCTV',
                to: '/cctvs',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: 'Runwayobject' }" />
        <VerticalNavLink
            :item="{
                title: '이상 객체',
                to: '/strangeObjects',
            }"
        />
        <VerticalNavLink
            :item="{
                title: '작업자',
                to: '/workers',
            }"
        />
        <VerticalNavLink
            :item="{
                title: '조업차량',
                to: '/workTrucks',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '활주로 노면 손상 관리' }" />
        <VerticalNavLink
            :item="{
                title: '활주로 손상',
                to: '/runwayCracks',
            }"
        />
        <VerticalNavLink
            :item="{
                title: '손상 보고서',
                to: '/runwayCrackReports',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '장비 분석 관리' }" />
        <VerticalNavLink
            :item="{
                title: '장비 보고서',
                to: '/equipmentReports',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '장비 현황 관리' }" />
        <VerticalNavLink
            :item="{
                title: '장비',
                to: '/equipment',
            }"
        />
    </ul>
</template>
