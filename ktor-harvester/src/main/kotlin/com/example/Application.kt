package com.example
import com.google.gson.Gson
import connectToDatabase
import runTheHarvester
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import io.ktor.server.plugins.cors.routing.*
import org.jetbrains.exposed.sql.deleteAll
import java.util.UUID


fun main() {
    embeddedServer(Netty, port = 8080, module = Application::module).start(wait = true)
}

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}

fun Application.configureCORS() {
    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowCredentials = true
        allowHost("localhost:5173")
    }
}


fun Application.module() {
    connectToDatabase()
    configureSerialization()
    configureCORS()

    routing {
        post("/scan") {
            val contentType = call.request.contentType()
            if (contentType != ContentType.Application.Json) {
                call.respond(HttpStatusCode.UnsupportedMediaType, "Expected application/json")
                return@post
            }

            val body = call.receive<ScanRequest>()
            val domain = body.domain
            if(domain.isEmpty()) {
                call.respond(HttpStatusCode.BadRequest, "Domain is required")
                return@post
            }

            val scanId = UUID.randomUUID().toString()


            // Start time of scan
            val startTime = LocalDateTime.now()

            // Run theHarvester and get the result
            val scanResult = runTheHarvester(domain)

            // End time of scan
            val endTime = LocalDateTime.now()

            // Save scan to database
            transaction {
                Scans.insert {
                    it[Scans.domain] = domain
                    it[Scans.startTime] = startTime.toString()
                    it[Scans.endTime] = endTime.toString()
                    it[Scans.result] = Gson().toJson(scanResult)
                }
            }

            // Respond with scan details
            call.respond(
                ScanResponse(
                    id = scanId,
                    domain = domain,
                    startTime = startTime.toString(),
                    endTime = endTime.toString(),
                    result = Gson().toJson(scanResult)
                )
            )
        }

        get("/scan-history") {
            val scans = transaction {
                Scans.selectAll().map {
                    ScanResponse(
                        id = it[Scans.id].toString(),
                        domain = it[Scans.domain],
                        startTime = it[Scans.startTime],
                        endTime = it[Scans.endTime],
                        result = it[Scans.result]
                    )
                }
            }
            if(scans.isNotEmpty()){
                call.respond(scans)
            }
            call.respond(HttpStatusCode.NotFound, "No Scans Yet")
        }

        route("/admin") {
            delete("/clear") {
                transaction {
                    Scans.deleteAll() // Removes all records from the Scans table
                }
                call.respond(HttpStatusCode.OK, "Database cleared successfully.")
            }
        }

    }
}

@Serializable
data class ScanRequest(val domain: String)

@Serializable
data class ScanResponse(val id: String, val domain: String, val startTime: String, val endTime: String, val result: String)
