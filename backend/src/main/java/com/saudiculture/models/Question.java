package com.saudiculture.models;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * MongoDB Document representing a cultural heritage question in the Saudi Culture platform.
 * <p>
 * This model supports multiple question types, bilingual content, regional categorization,
 * and optional image attachments for visual learning.
 * <p>
 * Indexed on: (category, region), (category, type), (region, type) for optimized filtering.
 */
@Data
@Document(collection = "questions")
@CompoundIndex(name = "category_region_index", def = "{'category': 1, 'region': 1}")
@CompoundIndex(name = "category_type_index", def = "{'category': 1, 'type': 1}")
@CompoundIndex(name = "region_type_index", def = "{'region': 1, 'type': 1}")
public class Question {

  /**
   * Unique identifier for the question.
   */
  @Id
  private String id;

  /**
   * Cultural term or concept being referenced (optional).
   * Example: "الكبسة" (Kabsa), "القهوة العربية" (Arabic Coffee)
   */
  private String term;

  /**
   * Meaning or definition of the cultural term (optional).
   */
  @Field("term_meaning")
  private String termMeaning;

  /**
   * The actual question text displayed to users.
   * Required field containing the question prompt.
   */
  @Field("question_text")
  @NotBlank(message = "Question text cannot be blank")
  private String questionText;

  /**
   * Array of answer choices for multiple-choice questions.
   * Required for: single_choice, multiple_choice question types.
   * Empty/null for: true_false, open_ended types.
   * <p>
   * Format: ["Option 1", "Option 2", "Option 3", "Option 4"]
   */
  private String[] options;

  /**
   * The correct answer to the question.
   * <p>
   * Format varies by question type:
   * - single_choice: Single answer text matching one option
   * - multiple_choice: Single answer or array of correct answers
   * - true_false: "صح" / "خطأ" (Arabic) or "True" / "False" (English)
   * - open_ended: Expected answer text
   */
  @NotBlank(message = "Answer cannot be blank")
  private String answer;

  /**
   * Content category for classification.
   * <p>
   * Common categories (examples):
   * - "Traditional Food" / "الطعام التقليدي"
   * - "Clothing" / "الملابس"
   * - "Festivals" / "المهرجانات"
   * - "Architecture" / "العمارة"
   * - "Music and Dance" / "الموسيقى والرقص"
   * - "Handicrafts" / "الحرف اليدوية"
   * - "Poetry and Literature" / "الشعر والأدب"
   * - "Customs and Traditions" / "العادات والتقاليد"
   * <p>
   * Note: Categories are user-defined and may expand over time.
   */
  @NotBlank(message = "Category cannot be blank")
  private String category;

  /**
   * Question type determining the interaction format.
   * <p>
   * Supported values:
   * - "single_choice": Multiple choice with one correct answer (MCQ)
   * - "multiple_choice": Multiple choice with multiple correct answers
   * - "true_false": True/False or صح/خطأ questions
   * - "open_ended": Free-text response questions
   * <p>
   * Note: Frontend may use "all" as a filter to request mixed types.
   */
  @NotBlank(message = "Type cannot be blank")
  private String type;

  /**
   * Language of the question content.
   * <p>
   * Supported values:
   * - "Arabic": Content in Arabic (العربية) - Default for most content
   * - "English": Content in English
   * <p>
   * This field determines the language of question_text, answer, options, and term fields.
   * Used for filtering and providing bilingual learning experiences.
   */
  @NotBlank(message = "Content language cannot be blank")
  @Field("content_language")
  private String contentLanguage;

  /**
   * Geographic region of Saudi Arabia the content relates to.
   * <p>
   * Supported values (case-insensitive, typically lowercase in frontend):
   * - "GENERAL" / "general": Pan-Saudi or non-region-specific content
   * - "WEST" / "west": Western Region (المنطقة الغربية) - Jeddah, Makkah, Madinah
   * - "EAST" / "east": Eastern Region (المنطقة الشرقية) - Dammam, Dhahran, Al-Ahsa
   * - "NORTH" / "north": Northern Region (المنطقة الشمالية) - Tabuk, Al-Jouf, Hail
   * - "SOUTH" / "south": Southern Region (المنطقة الجنوبية) - Asir, Jizan, Najran
   * - "CENTRAL" / "central": Central Region (المنطقة الوسطى) - Riyadh, Qassim
   * <p>
   * Note: Frontend uses lowercase, backend accepts both formats.
   */
  @NotBlank(message = "Region cannot be blank")
  private String region;

  /**
   * Optional reference source for the question content.
   * Examples: Book title, website, research paper, cultural authority.
   * <p>
   * Added in recent version to support content attribution and verification.
   */
  @Nullable
  private String source;

  /**
   * Binary image data stored directly in MongoDB (optional).
   * Contains the raw bytes of an image file.
   * <p>
   * Supported formats: PNG, JPEG, GIF, WebP, BMP
   * Storage: Binary data type in MongoDB
   * <p>
   * Use for: Visual questions, cultural artifacts, traditional items
   * Note: Either imageData or imageUrl may be used, not both
   */
  @Field("image_data")
  private byte[] imageData;

  /**
   * MIME type of the stored image data.
   * <p>
   * Common values:
   * - "image/png"
   * - "image/jpeg"
   * - "image/gif"
   * - "image/webp"
   * - "image/bmp"
   * <p>
   * Required when imageData is present.
   * Auto-detected from file signature (magic bytes) during upload.
   */
  @Field("image_mime_type")
  private String imageMimeType;

  /**
   * URL to an externally hosted image (optional).
   * Alternative to storing imageData directly in MongoDB.
   * <p>
   * Returned to frontend for display in InfoQuestionDTO and QuizQuestionDTO.
   * May be generated from imageData or point to external CDN/storage.
   */
  @Field("image_url")
  private String imageUrl;
}
