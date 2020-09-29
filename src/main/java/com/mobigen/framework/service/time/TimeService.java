package com.mobigen.framework.service.time;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Service
public class TimeService {

	public String getServerTime() throws Exception {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime date = LocalDateTime.now();
		return date.format(formatter);
	}

	public long getTimeOffset(String clientDatetime) {
		LocalDateTime serverDate = LocalDateTime.now();
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime clientDate = LocalDateTime.parse(clientDatetime, formatter);

		long offset = getTime(serverDate) - getTime(clientDate);
		return offset;
	}
	
	private long getTime(LocalDateTime lt) {
		Timestamp ts = Timestamp.valueOf(lt);
		return ts.getTime();
	}

}
