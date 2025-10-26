from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
from typing import List
import io

from app.models.user_model import User
from app.models.report_model import HealthReport
from app.models.healthlog_model import HealthLog


class PDFService:
    """Service for generating PDF health summaries"""
    
    @staticmethod
    def generate_health_summary(
        user: User,
        reports: List[HealthReport],
        logs: List[HealthLog]
    ) -> bytes:
        """Generate comprehensive health summary PDF"""
        
        # Create PDF buffer
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2C3E50'),
            alignment=TA_CENTER,
            spaceAfter=30
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#34495E'),
            spaceAfter=12
        )
        
        # Title
        title = Paragraph("Personal Health Record Summary", title_style)
        elements.append(title)
        elements.append(Spacer(1, 0.3*inch))
        
        # Patient Information
        elements.append(Paragraph("Patient Information", heading_style))
        
        patient_data = [
            ['Full Name:', user.full_name],
            ['Email:', user.email],
            ['Phone:', user.phone or 'N/A'],
            ['Blood Group:', user.blood_group or 'N/A'],
            ['Date of Birth:', user.date_of_birth.strftime('%Y-%m-%d') if user.date_of_birth else 'N/A'],
            ['Report Generated:', datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')]
        ]
        
        patient_table = Table(patient_data, colWidths=[2*inch, 4*inch])
        patient_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ECF0F1')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
        ]))
        
        elements.append(patient_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Medical Conditions
        if user.chronic_conditions or user.allergies:
            elements.append(Paragraph("Medical History", heading_style))
            
            medical_data = []
            if user.chronic_conditions:
                medical_data.append(['Chronic Conditions:', ', '.join(user.chronic_conditions)])
            if user.allergies:
                medical_data.append(['Allergies:', ', '.join(user.allergies)])
            
            medical_table = Table(medical_data, colWidths=[2*inch, 4*inch])
            medical_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#FADBD8')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
            ]))
            
            elements.append(medical_table)
            elements.append(Spacer(1, 0.3*inch))
        
        # Health Reports Summary
        if reports:
            elements.append(Paragraph(f"Health Reports ({len(reports)})", heading_style))
            
            report_data = [['Date', 'Type', 'Title', 'Doctor']]
            for report in reports[:10]:  # Last 10 reports
                report_data.append([
                    report.report_date.strftime('%Y-%m-%d'),
                    report.report_type.value.replace('_', ' ').title(),
                    report.title[:30],
                    report.doctor_name or 'N/A'
                ])
            
            report_table = Table(report_data, colWidths=[1.2*inch, 1.3*inch, 2*inch, 1.5*inch])
            report_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498DB')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
            ]))
            
            elements.append(report_table)
            elements.append(Spacer(1, 0.3*inch))
        
        # Recent Health Logs
        if logs:
            elements.append(Paragraph(f"Recent Health Logs ({len(logs)})", heading_style))
            
            log_data = [['Date', 'Temp (°F)', 'BP', 'Mood', 'Sleep (hrs)']]
            for log in logs[:15]:  # Last 15 logs
                bp = f"{log.blood_pressure_systolic}/{log.blood_pressure_diastolic}" if log.blood_pressure_systolic else 'N/A'
                log_data.append([
                    log.log_date.strftime('%Y-%m-%d'),
                    f"{log.temperature:.1f}" if log.temperature else 'N/A',
                    bp,
                    log.mood.value,
                    f"{log.sleep_hours:.1f}" if log.sleep_hours else 'N/A'
                ])
            
            log_table = Table(log_data, colWidths=[1.2*inch, 1*inch, 1*inch, 1.2*inch, 1.2*inch])
            log_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2ECC71')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.lightgreen),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
            ]))
            
            elements.append(log_table)
        
        # Footer
        elements.append(Spacer(1, 0.5*inch))
        footer_text = "This is a confidential medical document. Handle with care."
        footer = Paragraph(f"<i>{footer_text}</i>", styles['Normal'])
        elements.append(footer)
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF bytes
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes
