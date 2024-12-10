import java.io.BufferedReader
import java.io.InputStreamReader


fun parseHarvesterOutput(output: String): ScanResult {
    val ipRegex = Regex("""\b(?:\d{1,3}\.){3}\d{1,3}\b""")
    val linkedInRegex = Regex("""https?://[a-zA-Z0-9./]*linkedin\.com/[^\s]*""")
    val emailRegex = Regex("""[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}""")

    // List of emails to ignore (add any irrelevant emails here)
    val ignoredEmails = setOf("cmartorella@edge-security.com")

    val ips = ipRegex.findAll(output).map { it.value }.toList()
    val linkedInLinks = linkedInRegex.findAll(output).map { it.value }.toList()
    val emails = emailRegex.findAll(output)
        .map { it.value } // Extract matched emails
        .filter { it !in ignoredEmails } // Exclude irrelevant emails
        .toSet() // Ensure uniqueness
        .toList() // Convert back to list

    return ScanResult(
        ips = ips,
        linkedInLinks = linkedInLinks,
        emails = emails
    )
}

fun runTheHarvester(domain: String): ScanResult {
    val process = ProcessBuilder(
        "docker", "run", "--rm", "theharvester:latest", "-d", domain, "-b", "all"
    ).start()

    val result = StringBuilder()
    BufferedReader(InputStreamReader(process.inputStream)).use { reader ->
        var line: String?
        while (reader.readLine().also { line = it } != null) {
            result.append(line).append("\n")
        }
    }
    process.waitFor()
    return parseHarvesterOutput(result.toString())
}


data class ScanResult(
    val ips: List<String>,
    val linkedInLinks: List<String>,
    val emails: List<String>
)
