package hu.artur;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.*;

public class Main {
    public static void main(String[] args) {
        try{
            PDFTextStripper pdfTextStripper = new PDFTextStripper();
            PDDocument envelope = Loader.loadPDF(new File("src/main/resources/boríték test.pdf"));
            System.out.println(envelope.getNumberOfPages());
            System.out.println(pdfTextStripper.getText(envelope));

        } catch (IOException e){
            e.printStackTrace();
        }

    }


}
