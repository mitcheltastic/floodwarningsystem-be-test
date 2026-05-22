import { env } from 'process'

const PORT = 3001
const BASE_URL = `http://localhost:${PORT}/api`

async function runTests() {
  console.log('🚀 Starting API Integration Tests for "Si Citra Yang Banjir"...\n')

  try {
    // 1. Health check
    console.log('🔍 Checking API health...')
    const healthRes = await fetch(`${BASE_URL}/health`)
    const health = await healthRes.json() as any
    console.log('✅ Health status:', health)

    // Generate unique credentials to avoid collisions
    const rand = Math.floor(Math.random() * 100000)
    const testUser = {
      name: `Tester ${rand}`,
      username: `tester_${rand}`,
      email: `tester_${rand}@gmail.com`,
      password: 'password123',
    }

    // 2. Register
    console.log('\n📝 Registering test user...')
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    })
    const regData = await regRes.json() as any
    if (!regData.success) {
      throw new Error(`Register failed: ${JSON.stringify(regData)}`)
    }
    console.log('✅ Registered successfully!')

    // 3. Login
    console.log('🔑 Logging in to retrieve token...')
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUser.username,
        password: testUser.password,
      }),
    })
    const loginData = await loginRes.json() as any
    if (!loginData.success || !loginData.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`)
    }
    const token = loginData.token
    console.log('✅ Logged in successfully! Token retrieved.')

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    // ==========================================
    // 4. Test WilayahPantauan CRUD
    // ==========================================
    console.log('\n🗺️ Testing WilayahPantauan CRUD...')
    
    // Create
    const createWilayahRes = await fetch(`${BASE_URL}/wilayah-pantauan`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        nama: `Citarum Hulu ${rand}`,
        latitude: -6.9147,
        longitude: 107.6098,
      }),
    })
    const wCreate = await createWilayahRes.json() as any
    if (!wCreate.success) throw new Error(`Wilayah creation failed: ${JSON.stringify(wCreate)}`)
    const wilayahId = wCreate.data.id
    console.log(`✅ Created Wilayah! ID: ${wilayahId}, Nama: ${wCreate.data.nama}`)

    // Read list
    const listWilayahRes = await fetch(`${BASE_URL}/wilayah-pantauan`)
    const wList = await listWilayahRes.json() as any
    if (!wList.success) throw new Error(`Wilayah listing failed: ${JSON.stringify(wList)}`)
    console.log(`✅ Listed Wilayah! Count: ${wList.data.length}`)

    // Update
    const updateWilayahRes = await fetch(`${BASE_URL}/wilayah-pantauan/${wilayahId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        nama: `Citarum Hulu ${rand} (Updated)`,
      }),
    })
    const wUpdate = await updateWilayahRes.json() as any
    if (!wUpdate.success) throw new Error(`Wilayah update failed: ${JSON.stringify(wUpdate)}`)
    console.log('✅ Updated Wilayah successfully!')

    // ==========================================
    // 5. Test PosPantau CRUD
    // ==========================================
    console.log('\n🏢 Testing PosPantau CRUD...')

    // Create
    const createPosRes = await fetch(`${BASE_URL}/pos-pantau`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        nama: `Pos Pantau Utama ${rand}`,
        latitude: -6.9150,
        longitude: 107.6100,
      }),
    })
    const pCreate = await createPosRes.json() as any
    if (!pCreate.success) throw new Error(`PosPantau creation failed: ${JSON.stringify(pCreate)}`)
    const posId = pCreate.data.id
    console.log(`✅ Created PosPantau! ID: ${posId}, Nama: ${pCreate.data.nama}`)

    // Read list
    const listPosRes = await fetch(`${BASE_URL}/pos-pantau`)
    const pList = await listPosRes.json() as any
    if (!pList.success) throw new Error(`PosPantau listing failed: ${JSON.stringify(pList)}`)
    console.log(`✅ Listed PosPantau! Count: ${pList.data.length}`)

    // Update
    const updatePosRes = await fetch(`${BASE_URL}/pos-pantau/${posId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        nama: `Pos Pantau Utama ${rand} (Updated)`,
      }),
    })
    const pUpdate = await updatePosRes.json() as any
    if (!pUpdate.success) throw new Error(`PosPantau update failed: ${JSON.stringify(pUpdate)}`)
    console.log('✅ Updated PosPantau successfully!')

    // ==========================================
    // 6. Test PemantauanTerpadu CRUD
    // ==========================================
    console.log('\n📊 Testing PemantauanTerpadu CRUD...')

    // Create
    const createPemantauanRes = await fetch(`${BASE_URL}/pemantauan-terpadu`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        wilayahId,
        posId,
        curahHujan: 15.5,
        debitAir: 250.8,
        tinggiMukaAir: 120.4,
        tinggiGenangan: 10.0,
        suhuUdara: 27.5,
        kecepatanAngin: 12.4,
      }),
    })
    const tCreate = await createPemantauanRes.json() as any
    if (!tCreate.success) throw new Error(`PemantauanTerpadu creation failed: ${JSON.stringify(tCreate)}`)
    const pemantauanId = tCreate.data.id
    console.log(`✅ Created PemantauanTerpadu! ID: ${pemantauanId}, TMA: ${tCreate.data.tinggiMukaAir}`)

    // Read List (loads relations)
    const listPemantauanRes = await fetch(`${BASE_URL}/pemantauan-terpadu`)
    const tList = await listPemantauanRes.json() as any
    if (!tList.success) throw new Error(`PemantauanTerpadu listing failed: ${JSON.stringify(tList)}`)
    console.log(`✅ Listed PemantauanTerpadu! Count: ${tList.data.length}`)
    const details = tList.data.find((item: any) => item.id === pemantauanId)
    console.log(`   └─ Loaded Wilayah: "${details?.wilayah?.nama}", Pos: "${details?.pos?.nama}"`)

    // Update
    const updatePemantauanRes = await fetch(`${BASE_URL}/pemantauan-terpadu/${pemantauanId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        tinggiGenangan: 15.2,
      }),
    })
    const tUpdate = await updatePemantauanRes.json() as any
    if (!tUpdate.success) throw new Error(`PemantauanTerpadu update failed: ${JSON.stringify(tUpdate)}`)
    console.log('✅ Updated PemantauanTerpadu successfully!')

    // ==========================================
    // 7. Test PredictionResult CRUD
    // ==========================================
    console.log('\n🤖 Testing PredictionResult CRUD...')

    // Create
    const createPredictionRes = await fetch(`${BASE_URL}/prediction-result`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        inputReceived: { curah_hujan: 15.5, tma: 120.4 },
        classProbability: { class_0: 0.1, class_1: 0.8, class_2: 0.1, class_3: 0.0 },
        description: 'Potensi banjir sedang terdeteksi',
        floodClass: 1,
        floodLevel: 'SIAGA 3',
        riskLevel: 'SEDANG',
        tmaValue: 120.4,
      }),
    })
    const prCreate = await createPredictionRes.json() as any
    if (!prCreate.success) throw new Error(`PredictionResult creation failed: ${JSON.stringify(prCreate)}`)
    const predictionId = prCreate.data.id
    console.log(`✅ Created PredictionResult! ID: ${predictionId}, Flood Class: ${prCreate.data.floodClass}`)

    // Read list
    const listPredictionRes = await fetch(`${BASE_URL}/prediction-result`)
    const prList = await listPredictionRes.json() as any
    if (!prList.success) throw new Error(`PredictionResult listing failed: ${JSON.stringify(prList)}`)
    console.log(`✅ Listed PredictionResult! Count: ${prList.data.length}`)

    // Update
    const updatePredictionRes = await fetch(`${BASE_URL}/prediction-result/${predictionId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        riskLevel: 'TINGGI',
      }),
    })
    const prUpdate = await updatePredictionRes.json() as any
    if (!prUpdate.success) throw new Error(`PredictionResult update failed: ${JSON.stringify(prUpdate)}`)
    console.log('✅ Updated PredictionResult successfully!')

    // ==========================================
    // 8. Cleanup Created Entries (Testing Deletes)
    // ==========================================
    console.log('\n🧹 Cleaning up test entries...')
    
    // Delete PemantauanTerpadu
    const delPemantauanRes = await fetch(`${BASE_URL}/pemantauan-terpadu/${pemantauanId}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    const delPemantauanData = await delPemantauanRes.json() as any
    if (!delPemantauanData.success) throw new Error('Failed to delete PemantauanTerpadu')
    console.log('✅ Deleted test PemantauanTerpadu')

    // Delete WilayahPantauan
    const delWilayahRes = await fetch(`${BASE_URL}/wilayah-pantauan/${wilayahId}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    const delWilayahData = await delWilayahRes.json() as any
    if (!delWilayahData.success) throw new Error('Failed to delete WilayahPantauan')
    console.log('✅ Deleted test WilayahPantauan')

    // Delete PosPantau
    const delPosRes = await fetch(`${BASE_URL}/pos-pantau/${posId}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    const delPosData = await delPosRes.json() as any
    if (!delPosData.success) throw new Error('Failed to delete PosPantau')
    console.log('✅ Deleted test PosPantau')

    // Delete PredictionResult
    const delPredictionRes = await fetch(`${BASE_URL}/prediction-result/${predictionId}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    const delPredictionData = await delPredictionRes.json() as any
    if (!delPredictionData.success) throw new Error('Failed to delete PredictionResult')
    console.log('✅ Deleted test PredictionResult')

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉\n')
  } catch (error) {
    console.error('\n❌ INTEGRATION TEST FAILED:', (error as Error).message, '\n')
    process.exit(1)
  }
}

runTests()
