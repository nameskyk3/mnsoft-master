package com.mobigen.framework.utility;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;
import java.util.Map;

@Slf4j
public class JacksonParser {

    public static Map<String, Object> toMap(String json) {
        Map<String, Object> result = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            result = mapper.readValue(json, new TypeReference<Map<String, Object>>() {
            });
        } catch (Exception e) {
            //e.printStackTrace();
            log.error("JacksonParser toMap : " + e.toString());
        }

        return result;
    }

    public static List<Map<String, Object>> toList(String json) {
        List<Map<String, Object>> result = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            result = mapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {
            });
        } catch (Exception e) {
            //e.printStackTrace();
            log.error("JacksonParser toList : " + e.toString());
        }

        return result;
    }

    public static String toString(Object object) {
        return toString(object, "utf-8");
    }

    public static String toString(Object object, String charset) {
        ByteArrayOutputStream output = null;
        Writer write = null;
        String data = null;

        try {
            output = new ByteArrayOutputStream();
            write = new OutputStreamWriter(output, charset);

            ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(write, object);
            data = output.toString(charset);
        } catch (Exception e) {
            //e.printStackTrace();
            log.error("JacksonParser toString : " + e.toString());
        } finally {
            if (output != null) try {
                output.close();
            } catch (IOException e) {
            }
            if (write != null) try {
                write.close();
            } catch (IOException e) {
            }
        }

        return data;
    }
}
