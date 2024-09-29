from django import template

register = template.Library()

@register.filter
def recursive_category_list(category):
    html = f"<li data-category-id='{category.id}'>{category.button_name}</li>"
    if category.children.exists():
        html += "<ul>"
        for child in category.children.all():
            html += recursive_category_list(child)
        html += "</ul>"
    return html
