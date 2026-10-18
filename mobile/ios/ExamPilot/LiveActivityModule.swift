// React Native bridge for the exam Live Activity (Dynamic Island + lock screen).
// Exposed to JS as NativeModules.LiveActivity: start / update / end / isSupported.
import ActivityKit
import Foundation

@objc(LiveActivity)
class LiveActivityModule: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { false }

  private func state(from p: NSDictionary) -> Any? {
    guard #available(iOS 16.1, *) else { return nil }
    let ms = (p["examAt"] as? NSNumber)?.doubleValue ?? Date().timeIntervalSince1970 * 1000
    return ExamActivityAttributes.ContentState(
      code: p["code"] as? String ?? "",
      title: p["title"] as? String ?? "",
      examAt: Date(timeIntervalSince1970: ms / 1000),
      accent: p["accent"] as? String ?? "#2563EB",
      topicsDone: (p["topicsDone"] as? NSNumber)?.intValue ?? 0,
      topicsTotal: (p["topicsTotal"] as? NSNumber)?.intValue ?? 0
    )
  }

  @objc func isSupported(_ resolve: @escaping (Any?) -> Void, rejecter reject: @escaping (String?, String?, Error?) -> Void) {
    if #available(iOS 16.2, *) {
      resolve(ActivityAuthorizationInfo().areActivitiesEnabled)
    } else {
      resolve(false)
    }
  }

  /// Starts the activity, or updates the running one so there is never more than one.
  @objc func start(_ payload: NSDictionary, resolver resolve: @escaping (Any?) -> Void, rejecter reject: @escaping (String?, String?, Error?) -> Void) {
    guard #available(iOS 16.2, *), let s = state(from: payload) as? ExamActivityAttributes.ContentState else {
      reject("unsupported", "Live Activities need iOS 16.2 or later", nil)
      return
    }
    guard ActivityAuthorizationInfo().areActivitiesEnabled else {
      reject("disabled", "Live Activities are turned off for ExamPilot in Settings", nil)
      return
    }
    let content = ActivityContent(state: s, staleDate: s.examAt.addingTimeInterval(3 * 3600))
    if let running = Activity<ExamActivityAttributes>.activities.first {
      Task {
        await running.update(content)
        resolve(running.id)
      }
      return
    }
    do {
      let activity = try Activity.request(attributes: ExamActivityAttributes(), content: content, pushType: nil)
      resolve(activity.id)
    } catch {
      reject("start_failed", error.localizedDescription, error)
    }
  }

  @objc func update(_ payload: NSDictionary, resolver resolve: @escaping (Any?) -> Void, rejecter reject: @escaping (String?, String?, Error?) -> Void) {
    guard #available(iOS 16.2, *), let s = state(from: payload) as? ExamActivityAttributes.ContentState else {
      resolve(false)
      return
    }
    Task {
      for a in Activity<ExamActivityAttributes>.activities {
        await a.update(ActivityContent(state: s, staleDate: s.examAt.addingTimeInterval(3 * 3600)))
      }
      resolve(true)
    }
  }

  @objc func end(_ resolve: @escaping (Any?) -> Void, rejecter reject: @escaping (String?, String?, Error?) -> Void) {
    guard #available(iOS 16.2, *) else {
      resolve(false)
      return
    }
    Task {
      for a in Activity<ExamActivityAttributes>.activities {
        await a.end(nil, dismissalPolicy: .immediate)
      }
      resolve(true)
    }
  }

  @objc func isRunning(_ resolve: @escaping (Any?) -> Void, rejecter reject: @escaping (String?, String?, Error?) -> Void) {
    if #available(iOS 16.1, *) {
      resolve(!Activity<ExamActivityAttributes>.activities.isEmpty)
    } else {
      resolve(false)
    }
  }
}
