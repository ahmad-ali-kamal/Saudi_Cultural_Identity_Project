package com.saudiculture;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "file:.env")
@DisplayName("Application Context Tests")
class ApplicationTests {

	@Test
	@DisplayName("Should load application context successfully")
	void contextLoads() {
		// Context loads successfully with all beans
	}

}
