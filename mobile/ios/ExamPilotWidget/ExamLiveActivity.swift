// The exam countdown as a Live Activity: lock screen banner + Dynamic Island (compact, minimal, expanded).
// Styled after the Clear Glass design: glossy black island, subject accent, Urbanist-like rounded type.
import ActivityKit
import SwiftUI
import WidgetKit

extension Color {
  init(hex: String) {
    let s = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
    var v: UInt64 = 0
    Scanner(string: s).scanHexInt64(&v)
    self.init(
      red: Double((v >> 16) & 0xFF) / 255,
      green: Double((v >> 8) & 0xFF) / 255,
      blue: Double(v & 0xFF) / 255
    )
  }
}

private struct PlaneMark: View {
  var size: CGFloat = 16
  var body: some View {
    Image(systemName: "paperplane.fill")
      .font(.system(size: size, weight: .semibold))
      .foregroundStyle(.white)
  }
}

/// Live countdown text ("2d 4h", then "3:12:09" on exam day) that the system updates without the app running.
private struct Countdown: View {
  let to: Date
  var font: Font = .system(size: 15, weight: .semibold, design: .rounded)
  var body: some View {
    if to.timeIntervalSinceNow > 24 * 3600 {
      let days = Int(ceil(to.timeIntervalSinceNow / 86400))
      Text("\(days)d")
        .font(font)
        .monospacedDigit()
    } else {
      Text(timerInterval: Date()...max(Date(), to), countsDown: true)
        .font(font)
        .monospacedDigit()
        .multilineTextAlignment(.trailing)
    }
  }
}

private struct ProgressDots: View {
  let done: Int
  let total: Int
  let accent: Color
  var body: some View {
    HStack(spacing: 4) {
      ForEach(0..<max(total, 0), id: \.self) { i in
        Capsule()
          .fill(i < done ? accent : Color.white.opacity(0.22))
          .frame(height: 6)
      }
    }
  }
}

@available(iOS 16.2, *)
struct ExamLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: ExamActivityAttributes.self) { context in
      // Lock screen / banner
      let s = context.state
      let accent = Color(hex: s.accent)
      HStack(spacing: 14) {
        ZStack {
          RoundedRectangle(cornerRadius: 14, style: .continuous)
            .fill(LinearGradient(colors: [Color(hex: "#4A4A4F"), Color(hex: "#0E0E10")], startPoint: .top, endPoint: .bottom))
          PlaneMark(size: 18)
        }
        .frame(width: 48, height: 48)
        VStack(alignment: .leading, spacing: 4) {
          Text("Next exam · \(s.code)")
            .font(.system(size: 13, weight: .semibold, design: .rounded))
            .foregroundStyle(accent)
          Text(s.title)
            .font(.system(size: 17, weight: .semibold, design: .rounded))
            .lineLimit(1)
          Text(s.examAt, format: .dateTime.weekday(.abbreviated).day().month(.abbreviated).hour().minute())
            .font(.system(size: 13, design: .rounded))
            .foregroundStyle(.secondary)
          if s.topicsTotal > 0 {
            ProgressDots(done: s.topicsDone, total: s.topicsTotal, accent: accent)
              .padding(.top, 4)
          }
        }
        Spacer(minLength: 8)
        Countdown(to: s.examAt, font: .system(size: 26, weight: .semibold, design: .rounded))
          .frame(maxWidth: 110, alignment: .trailing)
      }
      .padding(16)
      .activityBackgroundTint(Color.white.opacity(0.9))
      .activitySystemActionForegroundColor(.black)
    } dynamicIsland: { context in
      let s = context.state
      let accent = Color(hex: s.accent)
      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          HStack(spacing: 8) {
            ZStack {
              Circle().fill(accent)
              Text(s.code)
                .font(.system(size: 11, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
                .minimumScaleFactor(0.6)
            }
            .frame(width: 36, height: 36)
            VStack(alignment: .leading, spacing: 0) {
              Text("Next exam")
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundStyle(.white.opacity(0.6))
              Text(s.examAt, format: .dateTime.weekday(.abbreviated).hour().minute())
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundStyle(.white)
            }
          }
          .padding(.leading, 4)
        }
        DynamicIslandExpandedRegion(.trailing) {
          Countdown(to: s.examAt, font: .system(size: 24, weight: .semibold, design: .rounded))
            .foregroundStyle(.white)
            .frame(maxWidth: 110, alignment: .trailing)
            .padding(.trailing, 4)
        }
        DynamicIslandExpandedRegion(.bottom) {
          VStack(alignment: .leading, spacing: 8) {
            Text(s.title)
              .font(.system(size: 17, weight: .semibold, design: .rounded))
              .foregroundStyle(.white)
              .lineLimit(1)
            if s.topicsTotal > 0 {
              HStack(spacing: 10) {
                ProgressDots(done: s.topicsDone, total: s.topicsTotal, accent: accent)
                Text("\(s.topicsDone)/\(s.topicsTotal) today")
                  .font(.system(size: 12, weight: .semibold, design: .rounded))
                  .foregroundStyle(.white.opacity(0.7))
                  .fixedSize()
              }
            }
          }
          .padding(.horizontal, 4)
        }
      } compactLeading: {
        HStack(spacing: 5) {
          Circle().fill(accent).frame(width: 8, height: 8)
          Text(s.code)
            .font(.system(size: 14, weight: .bold, design: .rounded))
            .foregroundStyle(.white)
        }
      } compactTrailing: {
        Countdown(to: s.examAt, font: .system(size: 14, weight: .semibold, design: .rounded))
          .foregroundStyle(accent)
          .frame(maxWidth: 64)
      } minimal: {
        ZStack {
          Circle().fill(accent)
          PlaneMark(size: 11)
        }
      }
      .keylineTint(accent)
    }
  }
}
