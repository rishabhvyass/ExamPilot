// Shared by the app (which starts / updates the activity) and the widget extension (which draws it).
import ActivityKit
import Foundation

@available(iOS 16.1, *)
struct ExamActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    /// Short subject code shown in the compact island, e.g. "SE".
    var code: String
    /// Full subject name for the expanded island and lock screen.
    var title: String
    /// Exam start; the countdown is drawn live by the system from this date.
    var examAt: Date
    /// Subject accent as a hex string, e.g. "#2563EB".
    var accent: String
    /// Today's checklist progress.
    var topicsDone: Int
    var topicsTotal: Int
  }
}
