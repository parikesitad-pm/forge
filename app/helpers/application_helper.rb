module ApplicationHelper
  def conversation_timestamp(time)
    time = time.in_time_zone("Asia/Jakarta")
    now = Time.current.in_time_zone("Asia/Jakarta")

    if time.to_date == now.to_date
      "Today • #{time.strftime("%H:%M")}"

    elsif time.to_date == now.to_date - 1
      "Yesterday • #{time.strftime("%H:%M")}"

    elsif time > 7.days.ago
      "#{time.strftime("%A")} • #{time.strftime("%H:%M")}"

    else
      "#{time.strftime("%d %b %Y")} • #{time.strftime("%H:%M")}"
    end
  end
end
