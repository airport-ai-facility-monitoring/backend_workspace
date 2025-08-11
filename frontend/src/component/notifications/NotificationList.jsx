import React, { useState, useEffect, useMemo } from 'react'
import NotificationItem from './NotificationItem'
import api from '../../config/api'
import './notification-list.css'

export default function NotificationList() {
  // 원본 전체 보관
  const [allItems, setAllItems] = useState([])

  // 화면에 표시할 분리된 목록
  const [importantItems, setImportantItems] = useState([])
  const [regularItems, setRegularItems] = useState([])

  // 검색/필터 상태
  const [query, setQuery] = useState('')
  const [onlyImportant, setOnlyImportant] = useState(false)
  const [dateFrom, setDateFrom] = useState('') // 'YYYY-MM-DD'
  const [dateTo, setDateTo] = useState('')     // 'YYYY-MM-DD'

  // 디바운스된 검색어
  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 200)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications')

        // 최신순 정렬
        const sorted = [...data].sort(
          (a, b) => new Date(b.writeDate) - new Date(a.writeDate)
        )

        // 공통 포맷으로 매핑 (원본 writerId도 보관해서 검색에 사용)
        const mapped = sorted.map((n) => ({
          id: n.notificationsId,
          time: formatDateTime(n.writeDate),
          writeDate: n.writeDate,
          writerIdRaw: n.writerId?.toString() ?? '',
          tag: maskWriterId(n.writerId?.toString()),
          text: n.title ?? '',
          isImportant: !!n.important,
        }))

        setAllItems(mapped)
      } catch (error) {
        console.error('공지 불러오기 실패:', error)
      }
    }

    fetchNotifications()
  }, [])

  // 필터링 로직 (메모이제이션)
  const filtered = useMemo(() => {
    const inDateRange = (iso) => {
      if (!iso) return true
      const d = new Date(iso)

      // 날짜만 비교(로컬 기준). dateTo 있으면 당일 23:59:59까지 포함
      let afterFrom = true
      let beforeTo = true

      if (dateFrom) {
        const from = new Date(dateFrom + 'T00:00:00')
        afterFrom = d >= from
      }
      if (dateTo) {
        const to = new Date(dateTo + 'T23:59:59')
        beforeTo = d <= to
      }
      return afterFrom && beforeTo
    }

    const q = debouncedQuery.toLowerCase()
    return allItems.filter((it) => {
      if (onlyImportant && !it.isImportant) return false
      if (!inDateRange(it.writeDate)) return false

      if (!q) return true
      // 제목(text) + 원본 작성자ID(writerIdRaw)에서 검색
      return (
        (it.text || '').toLowerCase().includes(q) ||
        (it.writerIdRaw || '').toLowerCase().includes(q)
      )
    })
  }, [allItems, debouncedQuery, onlyImportant, dateFrom, dateTo])

  // 화면용으로 중요/일반 분리 + 일반에 순번(order) 부여
  useEffect(() => {
    const imp = []
    const reg = []
    let order = 1

    for (const n of filtered) {
      const base = { ...n, order: null }
      if (n.isImportant) {
        imp.push(base)
      } else {
        reg.push({ ...base, order: order++ })
      }
    }
    setImportantItems(imp)
    setRegularItems(reg)
  }, [filtered])

  const resetFilters = () => {
    setQuery('')
    setOnlyImportant(false)
    setDateFrom('')
    setDateTo('')
  }

  // ===== helpers =====
  const formatDateTime = (isoDate) => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  const maskWriterId = (id) => {
    if (!id || id.length < 3) return id || ''
    return id[0] + '*'.repeat(id.length - 2) + id.slice(-1)
  }

  return (
    <div className="notification-list">
      {/* 검색/필터 바 */}
      <div className="notif-toolbar">
        <input
          type="text"
          placeholder="제목 또는 작성자ID로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="notif-input"
        />

        <label className="notif-checkbox">
          <input
            type="checkbox"
            checked={onlyImportant}
            onChange={(e) => setOnlyImportant(e.target.checked)}
          />
          중요만
        </label>

        <div className="notif-dates">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="notif-date"
          />
          <span>~</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="notif-date"
          />
        </div>

        <button type="button" onClick={resetFilters} className="notif-reset">
          초기화
        </button>
      </div>

      {/* 카운트 표시(선택) */}
      <div className="notif-count">
        총 {filtered.length}건
        {onlyImportant ? ' (중요만)' : ''}
      </div>

      {/* 중요 공지 */}
      {importantItems.map((item) => (
        <NotificationItem key={item.id} {...item} />
      ))}

      {/* 일반 공지 (순번 있음) */}
      {regularItems.map((item) => (
        <NotificationItem key={item.id} {...item} />
      ))}
    </div>
  )
}