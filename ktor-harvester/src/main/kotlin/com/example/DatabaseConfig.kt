import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

object Scans : Table() {
    val id = integer("id").autoIncrement()
    val domain = varchar("domain", 255)
    val startTime = varchar("start_time", 255)
    val endTime = varchar("end_time", 255)
    val result = text("result")
    override val primaryKey = PrimaryKey(id)
}

fun connectToDatabase() {
    Database.connect("jdbc:sqlite:scans.db", driver = "org.sqlite.JDBC")
    transaction {
        SchemaUtils.create(Scans)
    }
}
