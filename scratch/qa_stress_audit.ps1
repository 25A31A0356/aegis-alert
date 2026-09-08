# QA Stress & Edge-Case Testing Script for Phase 12
$env:Path = "C:\Program Files\nodejs;" + $env:Path
$baseUrl = "http://localhost:5000/api"

Write-Host "=== BRUTALLY STRICT QA & STRESS TESTING SUITE ===" -ForegroundColor Yellow

$bugsFound = @()

function Record-Bug {
    param(
        [string]$Severity,
        [string]$Category,
        [string]$Description,
        [string]$Impact
    )
    $script:bugsFound += [PSCustomObject]@{
        Severity = $Severity
        Category = $Category
        Description = $Description
        Impact = $Impact
    }
    Write-Host " [$Severity] $Category : $Description" -ForegroundColor $(
        if ($Severity -eq "CRITICAL") { "Red" }
        elseif ($Severity -eq "HIGH") { "Magenta" }
        elseif ($Severity -eq "MEDIUM") { "Yellow" }
        else { "Cyan" }
    )
}

# TEST 1: SOS Edge Cases
Write-Host "`n--- Testing SOS Beacon Edge Cases ---"
# Negative trapped count
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/sos" -Method Post -Body (@{
        userName = "Test"
        contactNumber = "123"
        emergencyType = "FLOOD"
        trappedCount = -5
        waterLevelMeters = -2.5
    } | ConvertTo-Json) -ContentType "application/json"
    if ($res.data.trappedCount -lt 0) {
        Record-Bug "MEDIUM" "SOS Validation" "API accepts negative trappedCount and negative water level without sanitization." "Distress records can store physically impossible -5 trapped citizens."
    }
} catch {
    Write-Host " Handled gracefully or rejected: $_"
}

# Non-existent SOS ID update
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/sos/non_existent_id_999/status" -Method Patch -Body (@{ status = "RESOLVED" } | ConvertTo-Json) -ContentType "application/json"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -ne 404) {
        Record-Bug "LOW" "SOS Error Handling" "Updating non-existent SOS ID returns non-404 status code: $($_.Exception.Response.StatusCode.value__)" "Inconsistent error response"
    }
}

# TEST 2: Community Report Edge Cases
Write-Host "`n--- Testing Community Report Edge Cases ---"
# Empty description
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/community-reports" -Method Post -Body (@{
        category = "Flooding"
        description = "   "
        location = "Harbor"
    } | ConvertTo-Json) -ContentType "application/json"
    Record-Bug "HIGH" "Community Report Validation" "API accepted whitespace-only description without validation." "Spam or blank incident reports can pollute emergency feed."
} catch {
    Write-Host " Correctly rejected blank description"
}

# Invalid status patch
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/community-reports/rep_01/status" -Method Patch -Body (@{
        status = "INVALID_STATUS_XYZ"
    } | ConvertTo-Json) -ContentType "application/json"
    Record-Bug "HIGH" "Community Report Triage" "API accepted invalid triage status 'INVALID_STATUS_XYZ'." "Corrupts triage state machine."
} catch {
    Write-Host " Correctly rejected invalid triage status"
}

# Upvoting non-existent report
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/community-reports/non_existent_rep_999/upvote" -Method Post
} catch {
    if ($_.Exception.Response.StatusCode.value__ -ne 404) {
        Record-Bug "LOW" "Community Report" "Upvoting non-existent report does not return 404." "Inconsistent error code."
    }
}

# TEST 3: Ask Aegis Chat Edge Cases
Write-Host "`n--- Testing Ask Aegis Chat Edge Cases ---"
# Empty / whitespace message
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/chat" -Method Post -Body (@{
        message = "   "
    } | ConvertTo-Json) -ContentType "application/json"
    Record-Bug "MEDIUM" "Chat Assistant" "API accepted blank whitespace chat query without rejection." "Stores empty query records in database."
} catch {
    Write-Host " Correctly rejected blank chat message"
}

# Extreme length message
try {
    $longStr = "help " * 500
    $res = Invoke-RestMethod -Uri "$baseUrl/chat" -Method Post -Body (@{
        message = $longStr
        forceOffline = $true
    } | ConvertTo-Json) -ContentType "application/json"
    if ($res.success -ne $true) {
        Record-Bug "LOW" "Chat Assistant" "Chat API failed on 2500 character emergency query." "Long messages may fail."
    }
} catch {
    Record-Bug "MEDIUM" "Chat Assistant" "Chat API crashed on long payload: $_" "Denial of service potential."
}

# TEST 4: Safe Beacon Edge Cases
Write-Host "`n--- Testing Safe Beacon Edge Cases ---"
# Invalid safe beacon status
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/safe-beacon" -Method Post -Body (@{
        userName = "Tester"
        status = "SOME_RANDOM_STATE"
    } | ConvertTo-Json) -ContentType "application/json"
    if ($res.success -eq $true -and $res.data.status -eq "SOME_RANDOM_STATE") {
        Record-Bug "HIGH" "Safe Beacon Validation" "API accepts arbitrary status string outside of ('SAFE', 'NEED HELP', 'UNABLE TO MOVE')." "Corrupts safe beacon aggregation."
    }
} catch {
    Write-Host " Handled or rejected invalid status"
}

# TEST 5: Profile Edge Cases
Write-Host "`n--- Testing User Profile Edge Cases ---"
# Updating with null / empty object
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Put -Body (@{} | ConvertTo-Json) -ContentType "application/json"
    if ($res.success -ne $true) {
        Record-Bug "LOW" "Profile API" "Empty PUT /profile body causes unhandled exception." "Profile sync edge case."
    }
} catch {
    Write-Host " PUT /profile empty body handled: $_"
}

Write-Host "`n=== QA AUTOMATED BACKEND AUDIT SUMMARY ===" -ForegroundColor Yellow
Write-Host "Total Issues Flagged by Edge Case Tester: $($bugsFound.Count)"
