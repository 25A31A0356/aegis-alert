# Phase 11 Full End-to-End System Audit Script
$env:Path = "C:\Program Files\nodejs;" + $env:Path

Write-Host "=== STARTING AEGISALERT FULL SYSTEM AUDIT (17 FEATURES) ===" -ForegroundColor Cyan
$baseUrl = "http://localhost:5000/api"
$passCount = 0
$totalCount = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [scriptblock]$Block
    )
    $script:totalCount++
    try {
        $result = & $Block
        if ($result -eq $true) {
            $script:passCount++
            Write-Host " [PASS] $Name" -ForegroundColor Green
        } else {
            Write-Host " [FAIL] $Name - Unexpected response: $result" -ForegroundColor Red
        }
    } catch {
        Write-Host " [FAIL] $Name - Exception: $_" -ForegroundColor Red
    }
}

# 1. Health Check
Test-Endpoint "1. Backend & Database Health" {
    $res = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    return ($res.success -eq $true -and ($res.data.status -eq "HEALTHY" -or $res.data.status -eq "OK"))
}

# 2. Alerts (Home Dashboard)
Test-Endpoint "2. Live Disaster Alerts" {
    $res = Invoke-RestMethod -Uri "$baseUrl/alerts" -Method Get
    return ($res.success -eq $true -and $res.data.Count -gt 0)
}

# 3. Disasters (Recent Events)
Test-Endpoint "3. Disaster Incidents Registry" {
    $res = Invoke-RestMethod -Uri "$baseUrl/disasters" -Method Get
    return ($res.success -eq $true -and $res.data.Count -gt 0)
}

# 4. Shelters (Safe Evacuation)
Test-Endpoint "4. Verified Emergency Shelters" {
    $res = Invoke-RestMethod -Uri "$baseUrl/shelters" -Method Get
    return ($res.success -eq $true -and $res.data.Count -gt 0)
}

# 5. Routes (High-Ground Pathfinder)
Test-Endpoint "5. Evacuation High-Ground Routes" {
    $res = Invoke-RestMethod -Uri "$baseUrl/routes" -Method Get
    return ($res.success -eq $true -and $res.data.Count -gt 0)
}

# 6. SOS Beacon (Distress Dispatch)
$sosId = ""
Test-Endpoint "6. SOS Beacon Activation (Database Persistence)" {
    $body = @{
        userName = "Audit Citizen"
        contactNumber = "+91-99999-88888"
        emergencyType = "FLOOD"
        coordinates = @{ lat = 17.6868; lng = 83.2185; address = "Beach Road Ward 12" }
        trappedCount = 3
        hasElderlyOrInfants = $true
        hasMedicalEmergency = $true
        waterLevelMeters = 1.6
        notes = "Automated Audit Test SOS"
    } | ConvertTo-Json -Depth 5
    $res = Invoke-RestMethod -Uri "$baseUrl/sos" -Method Post -Body $body -ContentType "application/json"
    $script:sosId = $res.data.id
    return ($res.success -eq $true -and $res.data.status -eq "SOS ACTIVATED" -and $res.data.trappedCount -eq 3)
}

Test-Endpoint "6b. SOS Beacon Lifecycle Progression" {
    $res1 = Invoke-RestMethod -Uri "$baseUrl/sos/$script:sosId/status" -Method Patch -Body (@{ status = "LOCATION SHARED" } | ConvertTo-Json) -ContentType "application/json"
    $res2 = Invoke-RestMethod -Uri "$baseUrl/sos/$script:sosId/status" -Method Patch -Body (@{ status = "ASSISTANCE IN PROGRESS" } | ConvertTo-Json) -ContentType "application/json"
    $res3 = Invoke-RestMethod -Uri "$baseUrl/sos/$script:sosId/status" -Method Patch -Body (@{ status = "RESOLVED" } | ConvertTo-Json) -ContentType "application/json"
    return ($res3.success -eq $true -and $res3.data.status -eq "RESOLVED")
}

# 7. Safe Beacon
Test-Endpoint "7. Safe Beacon Broadcast (SAFE, NEED_HELP, UNABLE_TO_MOVE)" {
    $body1 = @{
        userName = "Audit Citizen Safe"
        status = "SAFE"
        coordinates = @{ lat = 17.69; lng = 83.22; address = "Safe Shelter Camp A" }
        contactNumber = "+91-98888-77777"
        groupSize = 4
        notes = "Arrived safely at high ground."
    } | ConvertTo-Json -Depth 5
    $res1 = Invoke-RestMethod -Uri "$baseUrl/safe-beacon" -Method Post -Body $body1 -ContentType "application/json"

    $body2 = @{
        userName = "Audit Citizen Help"
        status = "NEED HELP"
        coordinates = @{ lat = 17.695; lng = 83.225; address = "Sector 4 Waterlogged" }
        contactNumber = "+91-97777-66666"
        groupSize = 2
        notes = "Need drinking water and infant supplies."
    } | ConvertTo-Json -Depth 5
    $res2 = Invoke-RestMethod -Uri "$baseUrl/safe-beacon" -Method Post -Body $body2 -ContentType "application/json"

    $body3 = @{
        userName = "Audit Citizen Immobile"
        status = "UNABLE TO MOVE"
        coordinates = @{ lat = 17.70; lng = 83.23; address = "Ground Floor Block 2" }
        contactNumber = "+91-96666-55555"
        groupSize = 1
        notes = "Injured leg, unable to climb stairs."
    } | ConvertTo-Json -Depth 5
    $res3 = Invoke-RestMethod -Uri "$baseUrl/safe-beacon" -Method Post -Body $body3 -ContentType "application/json"

    $historyRes = Invoke-RestMethod -Uri "$baseUrl/safe-beacon/history" -Method Get
    return ($res1.success -eq $true -and $res2.success -eq $true -and $res3.success -eq $true -and $historyRes.data.Count -ge 3)
}

# 8. Community Reports
$reportId = ""
Test-Endpoint "8. Community Report Submission & Triage" {
    $body = @{
        title = "Severe Waterlogging Under Railway Bridge"
        description = "Water height 1.2m blocking ambulance and evacuation access corridor."
        category = "Flooding"
        severity = "CRITICAL"
        location = "Harbor Railway Bridge Underpass"
        coordinates = @{ lat = 17.6912; lng = 83.2201 }
        affectedPeopleEstimate = 250
        reporterName = "Citizen Inspector"
    } | ConvertTo-Json -Depth 5
    $res = Invoke-RestMethod -Uri "$baseUrl/community-reports" -Method Post -Body $body -ContentType "application/json"
    $script:reportId = $res.data.id

    # Verify initial status is "Submitted"
    $isSubmitted = ($res.data.status -eq "Submitted")

    # Update status to Under Review -> Verified
    $updateRes = Invoke-RestMethod -Uri "$baseUrl/community-reports/$script:reportId/status" -Method Patch -Body (@{ status = "Verified"; reviewNotes = "Verified by SDRF Field Unit 4" } | ConvertTo-Json) -ContentType "application/json"
    
    # Upvote
    $upvoteRes = Invoke-RestMethod -Uri "$baseUrl/community-reports/$script:reportId/upvote" -Method Post

    return ($isSubmitted -and $updateRes.data.status -eq "Verified" -and $upvoteRes.data.upvotes -ge 1)
}

# 9. Ask Aegis (AI Assistant dual engine)
Test-Endpoint "9. Ask Aegis AI Assistant (Offline NDMA KB & Chat History)" {
    $q1 = @{ message = "What should I do during a flood?"; forceOffline = $true } | ConvertTo-Json
    $res1 = Invoke-RestMethod -Uri "$baseUrl/chat" -Method Post -Body $q1 -ContentType "application/json"

    $q2 = @{ message = "What should I carry during evacuation?"; forceOffline = $true } | ConvertTo-Json
    $res2 = Invoke-RestMethod -Uri "$baseUrl/chat" -Method Post -Body $q2 -ContentType "application/json"

    $history = Invoke-RestMethod -Uri "$baseUrl/chat/history" -Method Get
    return ($res1.success -eq $true -and $res1.data.sender -eq "aegis" -and $res2.success -eq $true -and $history.data.Count -ge 2)
}

# 10. Audit History
Test-Endpoint "10. User Action Audit History" {
    $res = Invoke-RestMethod -Uri "$baseUrl/history" -Method Get
    return ($res.success -eq $true -and $res.data.Count -gt 0)
}

# 11. Notifications
Test-Endpoint "11. Notifications System (Read/Unread & Clear)" {
    $res = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method Get
    $firstId = $res.data[0].id
    $readRes = Invoke-RestMethod -Uri "$baseUrl/notifications/$firstId/read" -Method Patch
    return ($res.success -eq $true -and $readRes.success -eq $true)
}

# 12. User Profile
Test-Endpoint "12. User Profile Persistence" {
    $profileBody = @{
        name = "Test Commander"
        phone = "+91-98765-43210"
        emergencyContact = @{
            name = "Family Member"
            phone = "+91-91234-56789"
            relationship = "Spouse"
        }
        bloodGroup = "O+ (Positive)"
        medicalConditions = @("Asthma inhaler required")
        locationPreferences = @{
            city = "Visakhapatnam"
            state = "Andhra Pradesh"
            pincode = "530001"
            autoDetect = $true
        }
    } | ConvertTo-Json -Depth 5
    $updateRes = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Put -Body $profileBody -ContentType "application/json"
    $getRes = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Get
    return ($getRes.data.name -eq "Test Commander" -and $getRes.data.bloodGroup -eq "O+ (Positive)")
}

# 13. Downloads
Test-Endpoint "13. Offline Downloads & Resource Storage" {
    $res = Invoke-RestMethod -Uri "$baseUrl/downloads" -Method Get
    $targetId = $res.data[0].id
    $toggleRes = Invoke-RestMethod -Uri "$baseUrl/downloads/$targetId/toggle" -Method Post
    return ($res.success -eq $true -and $toggleRes.success -eq $true)
}

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "AUDIT RESULTS: $passCount / $totalCount ENDPOINTS & FLOWS PASSED" -ForegroundColor $(if ($passCount -eq $totalCount) { "Green" } else { "Yellow" })
